const asyncHandler = require("express-async-handler");
const Order = require("../model/Order");
const ParentProduct = require("../model/ParentProduct");
const Vendor = require("../model/Vendor");
const mongoose = require("mongoose");

const getMonthlyOrders = asyncHandler(async (req, res) => {
  const vendor = await Vendor.find({ name: `${req.params.vendorName}` });
  const products = await ParentProduct.find({
    vendor: new mongoose.Types.ObjectId(vendor[0]._id.toString()),
  });

  let order = await Order.aggregate([
    {
      $unwind: "$cart_item",
    },
    {
      $match: {
        "cart_item.product": {
          $in: products.map(
            (x) => new mongoose.Types.ObjectId(x._id.toString())
          ),
        },
        $expr: {
          $eq: [{ $month: "$payment_at" }, parseInt(req.params.month)],
        },
      },
    },
  ]);

  res.status(200).json(order);
});

const getMonthlySales = asyncHandler(async (req, res) => {
  const vendor = await Vendor.find({ name: `${req.params.vendorName}` });
  const products = await ParentProduct.find({
    vendor: new mongoose.Types.ObjectId(vendor[0]._id.toString()),
  });

  let sales = await Order.aggregate([
    {
      $unwind: "$cart_item",
    },
    {
      $match: {
        "cart_item.product": {
          $in: products.map(
            (x) => new mongoose.Types.ObjectId(x._id.toString())
          ),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$payment_at" },
        numberOfSales: { $sum: 1 },
      },
    },
  ]);

  res.status(200).json(sales);
});

const getProductsAmount = asyncHandler(async (req, res) => {
  const vendor = await Vendor.find({ name: `${req.params.vendorName}` });
  const products = await ParentProduct.find({
    vendor: new mongoose.Types.ObjectId(vendor[0]._id.toString()),
  });
  let order = await Order.aggregate([
    {
      $unwind: "$cart_item",
    },
  ]);
  let myArray = [];
  for (item of products) {
    let obj = {};
    obj["name"] = item.name;
    obj["amount"] = order
      .filter(
        (o) =>
          o.cart_item.product !== null &&
          o.cart_item.product.toString() === item._id.toString()
      )
      .reduce(
        (acc, o) => acc + o.cart_item.item_count * o.cart_item.quantity,
        0
      );
    myArray.push(obj);
  }

  res.status(200).json(myArray);
});

const getProducts = asyncHandler(async (req, res) => {
  const vendor = await Vendor.find({ name: `${req.params.vendorName}` });
  const products = await ParentProduct.find({
    vendor: new mongoose.Types.ObjectId(vendor[0]._id.toString()),
  });
  res.status(200).json(products);
});

const getVendors = asyncHandler(async (req, res) => {
  const vendor = await Vendor.find();
  res.status(200).json(vendor);
});

module.exports = {
  getMonthlyOrders,
  getProducts,
  getVendors,
  getMonthlySales,
  getProductsAmount,
};
