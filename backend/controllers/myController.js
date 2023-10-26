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
  let output = [
    { _id: 1, numberOfSales: 0 },
    { _id: 2, numberOfSales: 0 },
    { _id: 3, numberOfSales: 0 },
    { _id: 4, numberOfSales: 0 },
    { _id: 5, numberOfSales: 0 },
    { _id: 6, numberOfSales: 0 },
    { _id: 7, numberOfSales: 0 },
    { _id: 8, numberOfSales: 0 },
    { _id: 9, numberOfSales: 0 },
    { _id: 10, numberOfSales: 0 },
    { _id: 11, numberOfSales: 0 },
    { _id: 12, numberOfSales: 0 },
  ];
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
  console.log(sales);
  for (element of sales) {
    output[parseInt(element._id) - 1].numberOfSales = element.numberOfSales;
  }
  res.status(200).json(output);
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

  const myArray = products.map((p) => ({
    name: p.name,
    amount: order
      .filter(
        (o) =>
          o.cart_item.product !== null &&
          o.cart_item.product.toString() === p._id.toString()
      )
      .reduce(
        (acc, o) => acc + o.cart_item.item_count * o.cart_item.quantity,
        0
      ),
  }));

  //   for (item of products) {
  //     let obj = {};
  //     obj["name"] = item.name;
  //     obj["amount"] = order
  //       .filter(
  //         (o) =>
  //           o.cart_item.product !== null &&
  //           o.cart_item.product.toString() === item._id.toString()
  //       )
  //       .reduce(
  //         (acc, o) => acc + o.cart_item.item_count * o.cart_item.quantity,
  //         0
  //       );
  //     myArray.push(obj);
  //   }

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
