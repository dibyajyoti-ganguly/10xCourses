const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const app = express();

app.use(express.json());

app.use(cors());

//Create route skeletons for users

app.post("/user-signup", (req, res) => {});

app.post("/user-login", (req, res) => {});

app.get("/user-courses", (req, res) => {});

//Create route skeletons for admins

app.post("/admin-signup", (req, res) => {});

app.post("/admin-login", (req, res) => {});

app.post("/admin-create-course", (req, res) => {});

app.post("/admin-delete-course", (req, res) => {});

//Mention which port the server is listening on for incoming requests for this app

app.listen(3000);
