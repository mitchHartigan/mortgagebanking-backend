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
    user: "bigwave.server@gmail.com",
    pass: "ekcjnkfoyrkbldwx",
  },
});

app.get("/", (req, res) => {
  res.send("Big wave email server is up.");
  res.end();
});

app.post("/contact", (req, res) => {
  const { name, email, phone, message } = req.body;

  if (name && email && phone) {
    const mailOptions = {
      from: "bigwave.server@gmail.com",
      to: "info@bigwavewater.com",
      subject:
        "[bigwavewater.com Automated Message] - New message from contact form.",
      html: `
        <h4>Name: ${name}</h4>
        <h4>Email: ${email}</h4>
        <h4>Phone: ${phone}</h4>
        <h4>Message:</h4> <p>${message}</p>
        <br></br>
        <p>(This message was generated automatically from the contact form on bigwavewater.com)`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
        res.status(500).json(`Sorry - ${err}`);
      } else {
        console.log("email sent!" + info.response);
        res.status(200).json("success");
      }
    });
  }
});

app.post("/casestudy", (req, res) => {
  const { name, email, phone, message, study } = req.body;

  if (name && email && message && study) {
    const mailOptions = {
      from: "bigwave.server@gmail.com",
      to: "mitch.hartigan@gmail.com",
      subject:
        "[bigwavewater.com Automated Message] - New download request from case study form.",
      html: `
        <h4>Name: ${name}</h4>
        <h4>Email: ${email}</h4>
        <h4>Phone: ${phone}</h4>
        <h4>Study requested: ${study}</h4>
        <h4>Message:</h4> <p>${message}</p>
        <br></br>
        <p>(This message was generated automatically from the case study download form on bigwavewater.com)`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
        res.status(500).json(`Server error - ${err}`);
      } else {
        console.log("email sent!" + info.response);
        res.status(200).json("success");
      }
    });
  }
});

module.exports = app;
