const express = require("express");
const userRouter = express.Router();

const { UserModel, PurchasesModel } = require("../db");

userRouter.use(express.json());

userRouter.post("/signup", async (req, res) => {
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
