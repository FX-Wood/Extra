require("dotenv").config();
const express = require("express");
const ejsLayouts = require("express-ejs-layouts");
const db = require("./db/models");
const app = express();
const passport = require("./config/passportConfig");
const session = require("express-session");
const flash = require("connect-flash");
const isLoggedIn = require("./middleware/isLoggedIn");
const helmet = require("helmet");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

app.set("view engine", "ejs");

app.use(require("morgan")("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(ejsLayouts);
app.use(helmet());

const sessionStore = new SequelizeStore({
  db: db.sequelize,
  expiration: 30 * 60 * 1000,
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
  }),
);

// Use this line once to set up the store table
sessionStore.sync();

// This must come after the session and before passport
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  res.locals.profileImage = "img/150x150.png";
  next();
});

app.get("/", function (req, res) {
  res.render("index", { user: req.user });
});

app.get("/profile", isLoggedIn, function (req, res) {
  console.log("user", req.user);
  // const cards = await db.collection.count({where: {userId: req.user.id}, include: [db.card]})
  // const collections = await db.collection.count({where: {userId: req.user.id}})
  Promise.all([
    db.collection.count({ where: { userId: req.user.id }, include: [db.card] }),
    db.collection.count({ where: { userId: req.user.id } }),
  ]).then(([cards, collections]) => {
    res.render("profile", { user: req.user, collections, cards });
  });
});

app.use("/auth", require("./controllers/auth"));
app.use("/collections", require("./controllers/collections"));
app.use("/cards", require("./controllers/cards"));
app.use("/define", require("./controllers/twinword"));
app.use("/parsemd", require("./controllers/markdown-it"));

module.exports = app;
// var server = app.listen(process.env.PORT || 3000);
