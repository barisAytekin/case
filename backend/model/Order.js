const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    cart_item: [
      {
        product: mongoose.Schema.Types.ObjectId,
        item_count: mongoose.Schema.Types.Number,
        quantity: mongoose.Schema.Types.Number,
        cogs: mongoose.Schema.Types.Mixed,
      },
    ],
    payment_at: Date,
  },
  { collection: "Orders" }
);

module.exports = mongoose.model("Order", orderSchema);
