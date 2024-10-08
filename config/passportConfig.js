const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const db = require("../db/models");

passport.serializeUser(function cerealizeUser(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function deCerealizeUser(id, cb) {
  db.user
    .findByPk(id)
    .then(function (user) {
      cb(null, user);
    })
    .catch(cb);
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      password: "password",
    },
    function (email, password, cb) {
      db.user
        .findOne({
          where: { email: email },
        })
        .then(function (user) {
          if (!user || !user.validPassword(password)) {
            cb(null, false);
          } else {
            cb(null, user);
          }
        })
        .catch(cb);
    },
  ),
);

module.exports = passport;

