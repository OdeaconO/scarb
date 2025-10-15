// routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const pool = require("../db");

const router = express.Router();

const ID_UPLOAD_DIR = path.join(__dirname, "..", "uploads", "idProof");
fs.mkdirSync(ID_UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, ID_UPLOAD_DIR),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});
const upload = multer({ storage });

router.post(
  "/signup",
  upload.single("idProof"),
  [
    body("name").trim().notEmpty().withMessage("Name required"),
    body("phone").trim().isLength({ min: 7 }).withMessage("Phone invalid"),
    body("email").isEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 6 }).withMessage("Password min 6 chars"),
    body("idNumber").trim().notEmpty().withMessage("ID number required"),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { name, phone, address, email, idNumber, password } = req.body;

      // basic validation
      if (!name || !phone || !address || !email || !idNumber || !password)
        return res.status(400).json({ error: "Missing required fields." });

      // compress and save ID proof if provided
      let idProofPath = null;
      if (req.file) {
        const compressedFilename =
          "compressed-" + req.file.filename.replace(/\s+/g, "_");
        const compressedPath = path.join(ID_UPLOAD_DIR, compressedFilename);

        await sharp(req.file.path)
          .resize(1200, null, { withoutEnlargement: true })
          .jpeg({ quality: 75 })
          .toFile(compressedPath);

        // store web-accessible path relative to /uploads
        idProofPath = path
          .join("uploads", "idProof", compressedFilename)
          .replace(/\\/g, "/");
        // optional: remove original file
        try {
          fs.unlinkSync(req.file.path);
        } catch (e) {}
      }

      const hashed = await bcrypt.hash(password, 10);

      const insertQ =
        "INSERT INTO users(name, phone, address, email, id_number, id_proof, password) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING id, name, email, phone";
      const values = [
        name,
        phone,
        address,
        email,
        idNumber,
        idProofPath,
        hashed,
      ];

      const result = await pool.query(insertQ, values);
      const created = result.rows[0];

      res.status(201).json({ user: created });
    } catch (err) {
      console.error("signup error:", err);
      // unique constraint error handling (simple)
      if (err.code === "23505")
        return res
          .status(409)
          .json({ error: "Email or phone already exists." });
      res.status(500).json({ error: "Server error." });
    }
  }
);

router.post("/login", async (req, res) => {
  try {
    const { identity, password } = req.body;
    if (!identity || !password)
      return res.status(400).json({ error: "Missing credentials." });

    const q = isNaN(Number(identity))
      ? "SELECT * FROM users WHERE email=$1"
      : "SELECT * FROM users WHERE phone=$1";
    const result = await pool.query(q, [identity]);
    const user = result.rows[0];

    if (!user) return res.status(401).json({ error: "Invalid credentials." });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials." });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error("login error:", err);
    res.status(500).json({ error: "Server error." });
  }
});

module.exports = router;
