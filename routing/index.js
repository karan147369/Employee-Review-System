const express = require("express");
const routing = express.Router();
const client = require("../model/connectDb");
const dotenv = require("dotenv");
dotenv.config();
const key = process.env.JWT_KEY;
const jwt = require("jsonwebtoken");

routing.post("/login", async (req, res, next) => {
  try {
    const response = await client
      .db("ERS")
      .collection("user")
      .find({ username: req.body.username, password: req.body.password })
      .toArray();

    if (response.length === 0) {
      res.status(404).json({ success: false, error: "User not found" });
    } else {
      const token = jwt.sign({ username: req.body.username }, key);
      res.setHeader("set-cookie", `${response[0].admin}-token=${token}`);
      if (response[0].admin) return res.redirect("/adminPage/getEmpList/1/5");
      else return res.redirect("/userPage");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
routing.get("/userPage", (req, res) => {
  if (req.cookies["false-token"] !== undefined)
    return res.render("userPage.ejs");
  else return res.render("home.ejs");
});
routing.get("/adminPage/getEmpList/:pgNo/:limit", async (req, res) => {
  if (req.cookies["true-token"] !== undefined) {
    try {
      const skip = (parseInt(req.params.pgNo) - 1) * parseInt(req.params.limit);
      const response = await client
        .db("ERS")
        .collection("user")
        .find({}, { _id: 0 })
        .skip(skip)
        .limit(parseInt(req.params.limit))
        .toArray();

      if (response.length !== 0)
        return res.render("adminPage.ejs", { empList: response });
      else return res.render("adminPage.ejs", { empList: [] });
    } catch (err) {
      console.error("Error in api: " + err.message);
    }
  } else return res.render("home.ejs");
});
routing.get("/clear-cookie", (req, res) => {
  res.clearCookie("true-token", { path: "/", domain: "localhost" });
  res.clearCookie("false-token", { path: "/", domain: "localhost" });
  return res.render("home.ejs");
});

routing.get("*", (req, res) => {
  // const response = await client.db("ERS").collection("user").find({}).toArray();
  return res.render("home.ejs");
});
module.exports = routing;
