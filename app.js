"use strict";

const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

const AWS = require("aws-sdk");
const config = require("./_config");
const { response } = require("express");
AWS.config.update(config);

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mortgagebanking.server@gmail.com",
    pass: "wnhipfcaeheruqrg",
  },
});

app.get("/", (req, res) => {
  res.send("Mortgage banking email server is up.");
  res.end();
});

app.post("/contact", (req, res) => {
  const { name, email, phone, message } = req.body;

  if (name && email && phone) {
    const mailOptions = {
      from: "mortgagebanking.server@gmail.com",
      to: "mitch.hartigan@gmail.com",
      subject:
        "[mortgagebanking.law Automated Message] - New message from contact form.",
      html: `
        <h4>Name: ${name}</h4>
        <h4>Email: ${email}</h4>
        <h4>Phone: ${phone}</h4>
        <h4>Message:</h4> <p>${message}</p>
        <br></br>
        <p>(This message was generated automatically from the contact form on mortgagebanking.law)`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
        res.status(500).json(`Sorry - ${err}`);
      } else {
        console.log("Email sent!" + info.response);
        res.status(200).json("success");
      }
    });
  }
});

module.exports = app;
