

import multer from "multer";
import express from "express";
import { Pool } from "pg";
import { Router } from "express";


// Multer setup for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Add new item
Router.post("/", upload.single("image"), async (req, res) => {
  const { name, description, price } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const newItem = await Pool.query(
      "INSERT INTO items (name, description, price, image_url) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, description, price, imageUrl]
    );
    res.status(201).json(newItem.rows[0]);
  } catch (error) {
    console.error("Error adding item:", error.message);
    res.status(500).json({ error: "Failed to add item" });
  }
});

module.exports = Router;
