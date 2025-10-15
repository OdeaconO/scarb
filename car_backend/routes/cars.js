// routes/cars.js
const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const pool = require("../db");

const router = express.Router();

const CAR_UPLOAD_DIR = path.join(__dirname, "..", "uploads", "cars");
fs.mkdirSync(CAR_UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, CAR_UPLOAD_DIR),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});
const upload = multer({ storage });

const auth = require("../middlewares/auth");

// POST /api/cars/sell
router.post(
  "/sell",
  auth,
  upload.single("carImage"),
  [
    body("brand").trim().notEmpty().withMessage("Brand is required"),
    body("model").trim().notEmpty().withMessage("Model is required"),
    body("year").isInt({ min: 1886 }).withMessage("Provide a valid year"),
    body("userId").isInt().withMessage("userId is required"),
    body("mileage")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Mileage must be an integer"),
    body("contactPref")
      .optional()
      .isIn(["true", "false", true, false])
      .withMessage("contactPref invalid"),
  ],
  validateRequest,
  async (req, res) => {
    try {
      // parse fields
      const {
        brand,
        model,
        year,
        seating,
        transmission,
        bodyStyle,
        mileage,
        contactPref,
        userId,
      } = req.body;

      if (!brand || !model || !year || !userId) {
        return res.status(400).json({
          error: "Missing required fields (brand, model, year, userId).",
        });
      }

      // process image if present
      let carImagePath = null;
      if (req.file) {
        const compressedFilename =
          "compressed-" + req.file.filename.replace(/\s+/g, "_");
        const compressedPath = path.join(CAR_UPLOAD_DIR, compressedFilename);

        await sharp(req.file.path)
          .resize(1200, null, { withoutEnlargement: true })
          .jpeg({ quality: 75 })
          .toFile(compressedPath);

        carImagePath = path
          .join("uploads", "cars", compressedFilename)
          .replace(/\\/g, "/");
        // remove original
        try {
          fs.unlinkSync(req.file.path);
        } catch (e) {}
      }

      // normalize types
      const numericYear = parseInt(year, 10);
      const numericSeating = seating ? parseInt(seating, 10) : null;
      const numericMileage = mileage ? parseInt(mileage, 10) : null;
      const contact_pref =
        contactPref === "true" ||
        contactPref === "on" ||
        contactPref === true ||
        contactPref === "1";

      const insertQ = `INSERT INTO cars(user_id, brand, model, year, seating, transmission, body_style, mileage, image, contact_pref)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id`;

      const values = [
        userId,
        brand,
        model,
        numericYear,
        numericSeating,
        transmission || null,
        bodyStyle || null,
        numericMileage,
        carImagePath,
        contact_pref,
      ];

      const result = await pool.query(insertQ, values);
      res.status(201).json({ id: result.rows[0].id });
    } catch (err) {
      console.error("sell error:", err);
      res.status(500).json({ error: "Server error." });
    }
  }
);

// GET /api/cars
// Supports query params: page, q, brand, model, year, seating, transmission, body_style
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      q,
      brand,
      model,
      year,
      seating,
      transmission,
      body_style,
    } = req.query;

    const limit = 16;
    const offset = (Math.max(1, parseInt(page || 1, 10)) - 1) * limit;

    const where = [];
    const params = [];
    let idx = 1;

    if (q) {
      params.push(`%${q}%`);
      where.push(
        `(brand ILIKE $${idx} OR model ILIKE $${idx} OR body_style ILIKE $${idx})`
      );
      idx++;
    }
    if (brand) {
      params.push(`%${brand}%`);
      where.push(`brand ILIKE $${idx}`);
      idx++;
    }
    if (model) {
      params.push(`%${model}%`);
      where.push(`model ILIKE $${idx}`);
      idx++;
    }
    if (year) {
      params.push(parseInt(year, 10));
      where.push(`year = $${idx}`);
      idx++;
    }
    if (seating) {
      params.push(parseInt(seating, 10));
      where.push(`seating = $${idx}`);
      idx++;
    }
    if (transmission) {
      params.push(transmission);
      where.push(`transmission = $${idx}`);
      idx++;
    }
    if (body_style) {
      params.push(body_style);
      where.push(`body_style = $${idx}`);
      idx++;
    }

    const whereClause = where.length ? "WHERE " + where.join(" AND ") : "";

    const countQ = `SELECT COUNT(*)::int AS total FROM cars ${whereClause}`;
    const countRes = await pool.query(countQ, params);
    const total = countRes.rows[0]?.total || 0;

    // add limit/offset params
    params.push(limit, offset);
    const dataQ = `
      SELECT id, user_id, brand, model, year, seating, transmission, body_style, mileage, image, contact_pref
      FROM cars
      ${whereClause}
      ORDER BY id DESC
      LIMIT $${idx} OFFSET $${idx + 1}
    `;
    const dataRes = await pool.query(dataQ, params);

    res.json({ cars: dataRes.rows, total });
  } catch (err) {
    console.error("get cars error:", err);
    res.status(500).json({ error: "Server error." });
  }
});

// GET /api/cars/:id
router.get("/:id", async (req, res) => {
  try {
    const carId = parseInt(req.params.id, 10);
    const q = `SELECT id, user_id, brand, model, year, seating, transmission, body_style, mileage, image, contact_pref FROM cars WHERE id = $1`;
    const result = await pool.query(q, [carId]);
    if (!result.rows.length)
      return res.status(404).json({ error: "Car not found." });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("get car by id error:", err);
    res.status(500).json({ error: "Server error." });
  }
});

module.exports = router;
