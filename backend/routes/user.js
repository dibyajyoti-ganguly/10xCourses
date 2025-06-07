const express = require("express");
const { z } = require("zod");
const userRouter = express.Router();

const { UserModel, PurchasesModel } = require("../db");

userRouter.use(express.json());

//Middleware for user auth
const userAuth = (req, res, next) => {
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

userRouter.post("/signup", userAuth, async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;

  await UserModel.create({
    email: email,
    password: password,
    firstName: firstName,
    lastName: lastName,
  });

  res.status(200).json("User sucessfully signed up");
});

userRouter.post("/login", (req, res) => {});

userRouter.get("/purchases", (req, res) => {
  res.json("No records to show");
});

module.exports = userRouter;
