require("dotenv").config();

const mongoose = require("mongoose");
mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}`
);

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const User = new Schema({
  email: { type: String, unique: true },
  password: String,
  firstName: String,
  lastName: String,
});

const Admin = new Schema({
  email: { type: String, unique: true },
  password: String,
  firstName: String,
  lastName: String,
});

const Course = new Schema({
  name: String,
  description: String,
  price: Number,
  //imageUrl: String,
  creatorId: ObjectId,
});

const Purchases = new Schema({
  courseId: ObjectId,
  userId: ObjectId,
});

const UserModel = mongoose.model("users", User);
const AdminModel = mongoose.model("admin", Admin);
const CourseModel = mongoose.model("courses", Course);
const PurchasesModel = mongoose.model("purchases", Purchases);

module.exports = {
  UserModel,
  AdminModel,
  CourseModel,
  PurchasesModel,
};
