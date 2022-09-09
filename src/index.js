import express from "express";
import "./db/mongoose.js";
import userRouter from "./routers/user.js";
import chalk from "chalk";
import cors from "cors";
import bodyParser from "body-parser";
// import fs from 'fs';
// import path from 'path'
import "dotenv/config";
import multer from "multer";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(userRouter);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set("view engine", "ejs");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

app.listen(port, () => {
  console.log(
    chalk.magenta.bold.underline("Server is up on port ") +
      chalk.blue.bold.underline(port)
  );
});

app.get("/", function (request, response) {
  response.send("Welcome to Task Server");
});
