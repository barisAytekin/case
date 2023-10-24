const express = require("express");
const router = express.Router();

const {
  getMonthlyOrders,
  getProducts,
  getVendors,
  getMonthlySales,
  getProductsAmount,
} = require("../controllers/myController");
router.get("/vendors", getVendors);
router.get("/monthlysales/:vendorName", getMonthlySales);
router.get("/products/:vendorName", getProducts);
router.get("/monthly/:vendorName/:month", getMonthlyOrders);
router.get("/productsamount/:vendorName", getProductsAmount);
module.exports = router;
