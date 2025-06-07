const express = require("express");
const { z } = require("zod");
const adminRouter = express.Router();

const { AdminModel, CourseModel } = require("../db");

adminRouter.use(express.json());

//Middleware for admin auth
const adminAuth = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password)
    return res.status(400).json("400 Bad Request - missing field(s)");

  const User = z.object({
    email: z.string().min(3).max(100).email(),
    password: z.string().min(3).max(100),
  });

  const parsedDatawithSuccess = User.safeParse({ email, password });

  if (!parsedDatawithSuccess.success)
    return res.status(400).json(parsedDatawithSuccess.error.issues[0].message);

  next();
};

adminRouter.post("/signup", adminAuth, (req, res) => {});

adminRouter.post("/login", (req, res) => {});

adminRouter.post("/course", (req, res) => {});

adminRouter.put("/course", (req, res) => {});

module.exports = adminRouter;
