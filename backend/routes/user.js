require("dotenv").config();

const express = require("express");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRouter = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

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

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await UserModel.create({
      email: email,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
    });
  } catch (e) {
    return res.status(400).json(e);
  }

  res.status(200).json("User sucessfully signed up");
}); //user signup route completed

userRouter.post("/login", userAuth, async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;

  const user = await UserModel.findOne({
    email: email,
    firstName: firstName,
    lastName: lastName,
  });

  if (!user)
    return res.status(400).json("User with given email or name not found");

  console.log(user);

  const isPasswordTrue = await bcrypt.compare(password, user.password);

  if (!isPasswordTrue)
    return res.status(400).json("Incorrect password - please try again");

  const userId = user._id.toString();

  //JWT logic
  const token = jwt.sign({ id: userId }, JWT_SECRET);

  res.status(200).json({
    message: "User has scuccessfully logged in",
    token: token,
  });
}); //User login route completed

userRouter.get("/purchases", (req, res) => {
  res.json("No records to show");
});

module.exports = userRouter;
