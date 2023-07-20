const express = require("express");
const app = express();
const route = require("./routing");
const cors = require("cors");
const port = process.env.PORT || 4000;
const path = require("path");
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(express.static("assets"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/", route);
app.use(cors());

app.listen(port, "0.0.0.0");
