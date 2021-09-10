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

const _findDestination = (message) => {
  if (message === "Compliance Workshops") {
    return "official3173@gmail.com";
  }
  if (message === "Research Projects") {
    return "mitch.hartigan@gmail.com";
  }
  if (message === "Shared Conversations") {
    return "mortgagebanking.server@gmail.com";
  } else {
    return "mitch.hartigan@gmail.com";
  }
};

const _parseMessage = (message) => {
  if (
    message === "Compliance Workshops" ||
    message === "Research Projects" ||
    message === "Shared Conversations"
  ) {
    return `Hey! I'm interested in the ${message} initiative and I'd like some more information.`;
  } else {
    return message;
  }
};

app.get("/", (req, res) => {
  res.send("Mortgage banking email server is up.");
  res.end();
});

app.post("/contact", (req, res) => {
  const { name, email, phone, message } = req.body;

  if (name && email && phone && message) {
    const mailOptions = {
      from: "mortgagebanking.server@gmail.com",
      to: _findDestination(message),
      subject:
        "[mortgagebanking.law Automated Message] - New message from contact form.",
      html: `
        <h4>Name: ${name}</h4>
        <h4>Email: ${email}</h4>
        <h4>Phone: ${phone}</h4>
        <h4>Message:</h4> <p>${_parseMessage(message)}</p>
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
