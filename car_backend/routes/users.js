// routes/users.js
const express = require("express");
const pool = require("../db");
const router = express.Router();

// Get account info for a user by ID
router.get("/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const q =
      "SELECT id, name, phone, address, email, id_number, id_proof FROM users WHERE id = $1";
    const result = await pool.query(q, [userId]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: "User not found." });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("get user error:", err);
    res.status(500).json({ error: "Server error." });
  }
});

// Get a user's car listings
router.get("/:id/listings", async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const q =
      "SELECT id, brand, model, year, image FROM cars WHERE user_id = $1 ORDER BY id DESC";
    const result = await pool.query(q, [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error("get user listings error:", err);
    res.status(500).json({ error: "Server error." });
  }
});

module.exports = router;
