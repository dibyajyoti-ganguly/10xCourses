const express = require("express");
const courseRouter = express.Router();

const { userTokenDecoder } = require("./user");
const { CourseModel, PurchasesModel } = require("../db");

courseRouter.use(express.json());

courseRouter.get("/preview", async (req, res) => {
  try {
    const courses = await CourseModel.find({});
    res.status(200).json(courses);
  } catch (e) {
    res.status(400).json(e);
  }
}); //see all courses

courseRouter.post("/purchase", userTokenDecoder, async (req, res) => {
  const userId = req.userId;

  const courseName = req.body.courseName;

  const course = await CourseModel.findOne({
    name: courseName,
  });

  if (!course)
    return res.status(400).json("The requested course was not found");

  try {
    await PurchasesModel.create({
      courseId: course._id.toString(),
      userId: userId,
    });
  } catch (e) {
    return res.status(400).json("The requested course could not be purchased");
  }

  res.status(200).json("Course purchased😋");
}); //purchase a course

module.exports = courseRouter;
