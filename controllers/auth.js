const express = require("express");
const router = express.Router();
const db = require("../db/models");
const passport = require("../config/passportConfig");

router.get("/signup", function (req, res) {
  res.render("auth/signup", { user: req.user });
});

router.post("/signup", function (req, res) {
  if (!req.signupCode === process.env.SIGNUP_KEY) {
    res.status(301).json(Error("Incorrect sign-up key"));
    throw Error("Incorrect sign-up key");
  } else {
    db.user
      .findOrCreate({
        where: { email: req.body.email },
        defaults: {
          name: req.body.name,
          password: req.body.password,
        },
      })
      .then(([user, created]) => {
        console.log("In signup, user created: ", created);
        if (created) {
          passport.authenticate("local", {
            successRedirect: "/",
            successFlash: "Account created and logged in",
          })(req, res);
        } else {
          console.log("Email already exists");
          req.flash("error", "Email already exists");
          res.redirect("/auth/signup");
        }
      })
      .catch((error) => {
        console.log(error);
        req.flash("error", error.errors[0].message);
        res.redirect("/auth/signup");
      });
  }
});

router.get("/login", function (req, res) {
  res.render("auth/login", { user: req.user });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successFlash: "You have logged in!",
    failureRedirect: "/auth/login",
    failureFlash: "Invalid credentials",
  }),
  (req, res) => res.render("index", { user: req.user }),
);

router.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.user = null;
    req.flash("success", "You have logged out!");
    res.redirect("/");
  });
});

module.exports = router;
