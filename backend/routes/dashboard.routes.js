import express from "express";
import { db } from "../db.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(authMiddleware);

// DASHBOARD STATS
router.get("/stats", async (req, res) => {
  try {
    const [[productCount]] = await db.query("SELECT COUNT(*) AS totalProducts FROM products");
    const [[supplierCount]] = await db.query("SELECT COUNT(*) AS totalSuppliers FROM suppliers");
    const [[stockSum]] = await db.query("SELECT SUM(stock) AS totalStock FROM products");
    const [[purchaseSum]] = await db.query("SELECT SUM(total) AS totalPurchaseAmount FROM purchases");
    const [[purchaseCount]] = await db.query("SELECT COUNT(*) AS totalPurchases FROM purchases");

    return res.json({
      success: true,
      data: {
        totalProducts: productCount.totalProducts,
        totalSuppliers: supplierCount.totalSuppliers,
        totalStock: stockSum.totalStock || 0,
        totalPurchaseAmount: purchaseSum.totalPurchaseAmount || 0,
        totalPurchases: purchaseCount.totalPurchases,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PURCHASE REPORT BY DATE
router.get("/purchases-report", async (req, res) => {
  try {
    const { from, to } = req.query;

    const [rows] = await db.query(
      `SELECT p.id, s.name AS supplier, p.total, p.created_at
       FROM purchases p
       JOIN suppliers s ON p.supplier_id = s.id
       WHERE DATE(p.created_at) BETWEEN ? AND ?
       ORDER BY p.created_at DESC`,
      [from, to]
    );

    return res.json({ success: true, data: rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// LOW STOCK PRODUCTS (<=5)
router.get("/low-stock", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name, stock FROM products WHERE stock <= 5 ORDER BY stock ASC"
    );

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("LOW STOCK ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;