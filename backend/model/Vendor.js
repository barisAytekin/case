const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    name: String,
  },
  { collection: "vendors" }
);

module.exports = mongoose.model("Vendor", vendorSchema);
