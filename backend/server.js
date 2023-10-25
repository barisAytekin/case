const express = require("express");
const dotenv = require("dotenv").config();
const connect = require("./config/db");
const port = process.env.PORT || 5001;

connect();
const app = express();
app.use(express.json());

app.use("/api", require("./routes/myRoutes"));
app.listen(port, () => console.log(`Server running on port ${port}`));
