import express from "express";
import { db } from "../db.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(authMiddleware);

router.get("/profit", async (req, res) => {
  try {
       // 🔒 block staff
    if (req.userRole !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only."
      });
    }
    const [rows] = await db.query(`
           SELECT 
        pr.name AS product_name,
        s.name AS supplier_name,
        pi.quantity,
        pi.price AS cost_price,
        pr.price AS selling_price,
        (pr.price - pi.price) * pi.quantity AS profit,
        pu.created_at AS purchase_date
      FROM purchases pu
      JOIN purchase_items pi ON pu.id = pi.purchase_id
      JOIN products pr ON pi.product_id = pr.id
      JOIN suppliers s ON pu.supplier_id = s.id
    `);


    res.json({
      success: true,
      data: rows
    });
  } catch (err) {
    console.error("PROFIT ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;