const express = require("express");
const courseRouter = express.Router();

const { CourseModel, PurchasesModel } = require("../db");

courseRouter.get("/preview", async (req, res) => {
  try {
    const courses = await CourseModel.find({});
    res.status(200).json(courses);
  } catch (e) {
    res.status(400).json(e);
  }
}); //see all courses

courseRouter.post("/purchase", (req, res) => {}); //purchase a course

module.exports = courseRouter;
