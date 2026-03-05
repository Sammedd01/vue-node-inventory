import express from "express";
import { db } from "../db.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();
router.use(authMiddleware);

// ADD PRODUCT
router.post("/add",isAdmin, async (req, res) => {
  try {
    const { name, category, sku, price, stock } = req.body;

    if (!name || !price) {
      return res
        .status(400)
        .json({ success: false, message: "Name and price required" });
    }

    await db.query(
      "INSERT INTO products (name, category, sku, price, stock) VALUES (?, ?, ?, ?, ?)",
      [name, category || null, sku || null, price, stock || 0]
    );

    return res.json({ success: true, message: "Product added" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET ALL PRODUCTS
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products ORDER BY id DESC");
    return res.json({ success: true, data: rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// UPDATE PRODUCT
// UPDATE PRODUCT
router.put("/:id",isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, sku, price, stock } = req.body;

    console.log("UPDATE ID:", id);
    console.log("BODY:", req.body);

    const [result] = await db.query(
      "UPDATE products SET name=?, category=?, sku=?, price=?, stock=? WHERE id=?",
      [name, category, sku, price, stock, id]
    );

    return res.json({
      success: true,
      affectedRows: result.affectedRows,
    });
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE PRODUCT
router.delete("/:id",isAdmin, async (req, res) => {
  try {
    const productId = req.params.id;

    const [result] = await db.query("DELETE FROM products WHERE id=?", [
      productId,
    ]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    return res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;