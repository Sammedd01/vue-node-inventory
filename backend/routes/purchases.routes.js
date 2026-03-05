import express from "express";
import { db } from "../db.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(authMiddleware);

// ADD PURCHASE (supplier + products)
router.post("/add", async (req, res) => {
  const { supplier_id, items } = req.body;
  // items = [{ product_id, quantity, price }]

  if (!supplier_id || !items || items.length === 0) {
    return res.status(400).json({ success: false, message: "Invalid data" });
  }

  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    // create purchase
    const [purchaseResult] = await conn.query(
      "INSERT INTO purchases (supplier_id, total) VALUES (?, ?)",
      [supplier_id, 0]
    );

    const purchaseId = purchaseResult.insertId;
    let total = 0;

    for (let item of items) {
      total += item.quantity * item.price;

      // insert purchase item
      await conn.query(
        "INSERT INTO purchase_items (purchase_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
        [purchaseId, item.product_id, item.quantity, item.price]
      );

      // update product stock
      await conn.query(
        "UPDATE products SET stock = stock + ? WHERE id = ?",
        [item.quantity, item.product_id]
      );
    }

    // update total
    await conn.query(
      "UPDATE purchases SET total = ? WHERE id = ?",
      [total, purchaseId]
    );

    await conn.commit();
    conn.release();

    res.json({ success: true, message: "Purchase saved" });
  } catch (err) {
    await conn.rollback();
    conn.release();
    res.status(500).json({ success: false, message: err.message });
  }
});

// VIEW PURCHASES (connected view)
router.get("/", async (req, res) => {
  const [rows] = await db.query(`
    SELECT p.id, s.name AS supplier, p.total, p.created_at
    FROM purchases p
    JOIN suppliers s ON p.supplier_id = s.id
    ORDER BY p.id DESC
  `);

  res.json({ success: true, data: rows });
});

// VIEW PURCHASE ITEMS (connected to products)
router.get("/:id", async (req, res) => {
  const [rows] = await db.query(`
    SELECT pr.name, pi.quantity, pi.price
    FROM purchase_items pi
    JOIN products pr ON pi.product_id = pr.id
    WHERE pi.purchase_id = ?
  `, [req.params.id]);

  res.json({ success: true, data: rows });
});

export default router;