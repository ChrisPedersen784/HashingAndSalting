require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bcrypt = require("bcrypt");
const saltRounds = parseInt(process.env.ROUNDS);

const app = express();



app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/BikeRentalDB")

const hashingSchema = new mongoose.Schema({
  email: String,
  password: String
});

const Hashing = mongoose.model("Hashing", hashingSchema);


app.get("/", function(req, res) {
  res.render("home");
});


app.post("/", function(req, res) {
  res.render("home");
});

app.get("/loginSucces", function(req, res) {
  res.render("loginSucces");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.post("/login", function(req, res) {
const username = req.body.email;
const password = req.body.password;

Hashing.findOne({
    email: username
  }, function(err, foundEmail) {
    if (err) {
      console.log(err);
    } else if (!foundEmail) {
      res.redirect("/register");
    } else {
      if (foundEmail) {
        bcrypt.compare(password, foundEmail.password, function(err, result) {
          // result == true
          if (result) {
            res.redirect("/loginSucces");
          } else {
            res.redirect("/login");
          }
        });
  }
}
});
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {

  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {
      // Store hash in your password DB.
      const username = req.body.email;
      const password = req.body.password;

      const newUser = new Hashing({
        email: username,
        password: hash
      });
      newUser.save(function(err) {
        if (err) {
          console.log(err);
        } else {
          res.redirect("/loginSucces");
        }
      });
    });
  });
});




app.listen("3000", function() {
  console.log("Server is running on port 3000");
});
