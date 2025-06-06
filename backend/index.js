const express = require("express");
const app = express();

const userRouter = require("./routes/user");
const courseRouter = require("./routes/course");

app.use("/user", userRouter); //all routes starting with user are handled by userRouter
app.use("/course", courseRouter); //all routes starting with course are handled by courseRouter

//Mention which port the server is listening on for incoming requests for this app

app.listen(3000);
