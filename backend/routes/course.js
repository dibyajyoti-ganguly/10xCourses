const express = require("express");
const courseRouter = express.Router();

courseRouter.get("/preview", (req, res) => {
  res.json("No records to show");
}); //see all courses

courseRouter.post("/purchase", (req, res) => {}); //purchase a course

module.exports = courseRouter;
