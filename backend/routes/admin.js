const express = require("express");
const adminRouter = express.Router();

const { AdminModel, CourseModel } = require("../db");

adminRouter.post("/signup", (req, res) => {});

adminRouter.post("/login", (req, res) => {});

adminRouter.post("/course", (req, res) => {});

adminRouter.put("/course", (req, res) => {});

module.exports = adminRouter;
