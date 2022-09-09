import express from "express";
import User from "../models/user.js";
import auth from "../middleware/auth.js";
import { request } from "express";
import chalk from "chalk";
import { Auth } from "two-step-auth";
const router = new express.Router();

const success = true;

//create user
router.post("/users/signup", async (req, res) => {
  const user = new User(req.body);
  console.log("request recieved");
  try {
    
    console.log(user);
    await user.save();
    console.log("user saved");
    const token = await user.generateAuthToken();
     if (!token) {
       res.send("token not generated");
     }
    res.status(200).send({user, token});
  } catch (e) {
    res.status(400).send(e);
  }
});

//user login
router.post("/users/login", async (req, res) => {
  if (req) {
    console.log(chalk.green.bold("request recieved"));
  }
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);

    if (!user) {
      res.send("user not found");
    }
    const token = await user.generateAuthToken();

    if (!token) {
      res.send("token not generated");
    }

    console.log(token);
    res.send(token);
  } catch (error) {
    res.status(401).send(error);
  }
});

//user logout
router.post("/users/logout", auth, async (req, res) => {
  try {
    console.log("herew")
    req.user.token = ""
    console.log(req.user)
    await req.user.save();
    res.status(200).send("Logout successfull");
  } catch (e) {
    res.status(500).send();
  }
});

// user detail
router.get("/users/me", auth, async (req, res) => {
  console.log("profile asked");
  res.status(202).send(req.user);
});

//get all users
router.get("/users", auth, async (req, res) => {
  console.log("users asked");
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(401).send(error);
  }
});

//updateuser
router.patch("/users/:id", auth, async (req, res) => {
  console.log(req.body);
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "name",
    "email",
    "password",
    "age",
    "gender",
    "dob",
    "mobile",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }
  console.log(req.body);
  let user = await User.findOne({
    _id: req.params.id,
  });

  try {
    updates.forEach((update) => (user[update] = req.body[update]));
    console.log(user);
    await user.save();
    console.log("user saved");
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

//delete user
router.delete("/users/:id", auth, async (req, res) => {
  console.log("delete requested", req.params.id);
  try {
    const user = await User.findOneAndDelete({
      _id: req.params.id,
    });
    if (!user) {
      console.log("user not found", req.params.id);
      res.status(404).send();
    }
    user.remove();
    console.log("user removed");
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send();
  }
});

export default router;
