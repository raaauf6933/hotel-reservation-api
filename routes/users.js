const express = require("express");
const router = express.Router();
const User = require("./../models/users");
const bcrypt = require("bcrypt");
const _ = require("lodash");

router.get("/", async (req, res) => {
  try {
    const result = await User.find();
    res.status(200).send(
      result.map((obj) => {
        return _.pick(
          obj,
          "_id",
          "first_name",
          "last_name",
          "username",
          "status",
          "createdAt"
        );
      })
    );
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/", async (req, res) => {
  const { body } = req;
  try {
    const result = await User.findById(body.id);
    res.status(200).send(result);
  } catch (error) {
    // not found
    if (error.kind === "ObjectId") {
      res.status(404).send({
        success: "false",
        message: error.message,
      });
    } else {
      res.status(400).send({
        success: "false",
        message: error.message,
      });
    }
  }
});

router.post("/create_user", async (req, res) => {
  const {
    username,
    password,
    confirm_password,
    first_name,
    last_name,
    email,
    user_type,
  } = req.body;

  if (password !== confirm_password)
    throw Error("Password and Confirmed Password are not match");

  let user = await User.findOne({ username });
  let verifyEmail = await User.findOne({ email });
  if (user)
    return res
      .status(400)
      .send({ status: "failed", message: "Username already registered." });

  if (verifyEmail)
    return res
      .status(400)
      .send({ status: "failed", message: "Email already registered." });

  try {
    if (password !== confirm_password)
      throw Error("Password and Confirmed Password are not match");

    user = new User({
      first_name,
      last_name,
      email,
      username,
      password,
      status: "ACT",
      user_type,
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    res.status(200).send(_.pick(user, ["_id", "username"]));
  } catch (error) {
    res.status(400).send({ status: "failed", message: error.message });
  }
});

router.post("/edit_user", async (req, res) => {
  const {
    id,
    username,
    password,
    confirm_password,
    first_name,
    last_name,
    email,
    user_type,
  } = req.body;

  try {
    let user = await User.findById(id);

    if (!user) {
      throw Error("User not found");
    }

    let verifyUser = await User.findOne({ username });
    let verifyEmail = await User.findOne({ email });
    if (verifyUser?.id !== id && verifyUser)
      return res
        .status(400)
        .send({ status: "failed", message: "Username already registered." });

    if (verifyEmail?.id !== id && verifyEmail)
      return res
        .status(400)
        .send({ status: "failed", message: "Email already registered." });

    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(password, salt);

    if (password !== confirm_password)
      throw Error("Password and Confirmed Password are not match");

    const result = await User.findByIdAndUpdate(
      id,
      {
        first_name,
        last_name,
        user_type,
        password: newPassword,
      },
      {
        new: true,
      }
    );

    return res.status(200).send(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

module.exports = router;
