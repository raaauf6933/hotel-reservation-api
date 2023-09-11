const express = require("express");
const Customers = require("./../models/customers");
const router = express.Router();
const bcrypt = require("bcrypt");

router.get("/", async (req, res) => {
  try {
    const result = await Customers.find();
    res.status(200).send(result);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/customer", async (req, res) => {
  try {
    const customer = await Customers.findById(req.query.id);

    res.status(200).send({
      ...customer._doc,
    });
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

router.post("/register", async (req, res) => {
  const data = req.body;

  try {
    if (data.password !== data.confirm_password)
      throw Error("Password and Confirmed Password are not match");

    let verifyEmail = await Customers.findOne({ email: data.email });

    if (verifyEmail)
      return res
        .status(400)
        .send({ status: "failed", message: "Email already registered." });

    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(data.password, salt);

    const result = await Customers.create({
      first_name: data.first_name,
      last_name: data.last_name,
      address: {
        address: data.address,
        city: data.city,
      },
      email: data.email,
      contact_number: data.contact_number,
      is_verified: false,
      password: password,
      status: "ACT",
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.post("/edit_customer", async (req, res) => {
  const data = req.body;

  try {
    let customer = await Customers.findById(data?.id);

    if (!customer) {
      throw Error("Customer not found");
    }

    if (data.password !== data.confirm_password)
      throw Error("Password and Confirmed Password are not match");

    let verifyEmail = await Customers.findOne({ email: data.email });

    if (verifyEmail?.id !== data.id && verifyEmail)
      return res
        .status(400)
        .send({ status: "failed", message: "Email already registered." });

    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(data.password, salt);

    const result = await Customers.findByIdAndUpdate(
      data.id,
      {
        first_name: data.first_name,
        last_name: data.last_name,
        address: {
          address: data.address,
          city: data.city,
        },
        email: data.email,
        contact_number: data.contact_number,
        is_verified: false,
        password: password,
        status: "ACT",
      },
      {
        new: true,
      }
    );

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

module.exports = router;
