const mongoose = require("mongoose");

const parentProductSchema = new mongoose.Schema(
  {
    name: String,
    vendor: mongoose.Schema.Types.ObjectId,
  },
  { collection: "Parent Products" }
);

module.exports = mongoose.model("ParentProduct", parentProductSchema);
