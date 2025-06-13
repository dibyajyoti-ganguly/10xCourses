require("dotenv").config();

const express = require("express");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const adminRouter = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

const { AdminModel, CourseModel } = require("../db");

adminRouter.use(express.json());

//Middleware for admin auth
const adminAuth = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password)
    return res.status(400).json("400 Bad Request - missing field(s)");

  const Admin = z.object({
    email: z.string().min(3).max(100).email(),
    password: z.string().min(3).max(100),
  });

  const parsedDatawithSuccess = Admin.safeParse({ email, password });

  if (!parsedDatawithSuccess.success)
    return res.status(400).json(parsedDatawithSuccess.error.issues[0].message);

  next();
};

adminRouter.post("/signup", adminAuth, async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await AdminModel.create({
      email: email,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
    });
  } catch (e) {
    return res.status(400).json(e);
  }

  res.status(200).json("Admin sucessfully signed up");
}); // admin signup route completed

adminRouter.post("/login", adminAuth, async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;

  const admin = await AdminModel.findOne({
    email: email,
    firstName: firstName,
    lastName: lastName,
  });

  if (!admin)
    return res.status(400).json("Admin with given email or name not found");

  console.log(admin);

  const isPasswordTrue = await bcrypt.compare(password, admin.password);

  if (!isPasswordTrue)
    return res.status(400).json("Incorrect password - please try again");

  const adminId = admin._id.toString();

  //JWT logic
  const token = jwt.sign({ id: adminId }, JWT_SECRET);

  res.status(200).json({
    message: "Admin has scuccessfully logged in",
    token: token,
  });
}); //admin login route completed

const adminTokenDecoder = async (req, res, next) => {
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, JWT_SECRET);

  if (!decoded) return res.status(403).json("Missing token");

  const adminId = decoded.id;

  const admin = await AdminModel.findOne({
    _id: adminId,
  });

  if (!admin) return res.status(403).json("Invalid token");

  req.adminId = adminId;

  next();
}; //Middleware for token verification

adminRouter.post("/course", adminTokenDecoder, async (req, res) => {
  try {
    const course_name = req.body.course_name;
    const description = req.body.description;
    const price = req.body.price;
    const creatorId = req.adminId;

    await CourseModel.create({
      name: course_name,
      description: description,
      price: price,
      creatorId: creatorId,
    });
    res.status(200).json("Course created successfully");
  } catch (e) {
    res.status(400).json({
      message: "Course creation error",
      error: e,
    });
  }
}); //route for admin to create a course

adminRouter.put("/course", adminTokenDecoder, async (req, res) => {
  try {
    const old_name = req.body.old_name;

    const new_name = req.body.new_name;
    const creatorId = req.adminId;

    await CourseModel.updateOne(
      { name: old_name, creatorId: creatorId },
      { $set: { name: new_name } }
    );

    res.status(200).json("Course name successfully updated");
  } catch (e) {
    res.status(400).json(e);
  }
});

module.exports = adminRouter;
