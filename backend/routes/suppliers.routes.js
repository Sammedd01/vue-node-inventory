import express from "express";
import { db } from "../db.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { isAdmin } from './../middleware/roleMiddleware.js';

const router = express.Router();
router.use(authMiddleware);

// ADD SUPPLIER
router.post("/add",isAdmin, async (req, res) => {
  try {
    const { name, phone, email, address } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Supplier name required" });
    }

    await db.query(
      "INSERT INTO suppliers (name, phone, email, address) VALUES (?, ?, ?, ?)",
      [name, phone, email, address]
    );

    return res.json({ success: true, message: "Supplier added" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET ALL SUPPLIERS
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM suppliers ORDER BY id DESC");
    return res.json({ success: true, data: rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// UPDATE SUPPLIER
router.put("/:id",isAdmin, async (req, res) => {
  try {
    const { name, phone, email, address } = req.body;
    const supplierId = req.params.id;

    const [result] = await db.query(
      "UPDATE suppliers SET name=?, phone=?, email=?, address=? WHERE id=?",
      [name, phone, email, address, supplierId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Supplier not found" });
    }

    return res.json({ success: true, message: "Supplier updated" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE SUPPLIER
router.delete("/:id",isAdmin, async (req, res) => {
  try {
    const supplierId = req.params.id;

    const [result] = await db.query("DELETE FROM suppliers WHERE id=?", [supplierId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Supplier not found" });
    }

    return res.json({ success: true, message: "Supplier deleted" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;