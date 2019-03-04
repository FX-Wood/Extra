require('dotenv').config();
const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const db = require('./db/models');
const app = express();
const passport = require('./config/passportConfig');
const session = require('express-session');
const flash = require('connect-flash');
const isLoggedIn = require('./middleware/isLoggedIn');
const helmet = require('helmet');
const SequelizeStore = require('connect-session-sequelize')(session.Store)


app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(ejsLayouts);
app.use(helmet())

const sessionStore = new SequelizeStore({
  db: db.sequelize,
  expiration: 30 * 60 * 1000
});

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: sessionStore
}));

// Use this line once to set up the store table
// sessionStore.sync()

// This must come after the session and before passport
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req,res,next) {
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  res.locals.profileImage = 'https://via.placeholder.com/150'
  next()
})

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile');
});

app.use('/auth', require('./controllers/auth'));
app.use('/collections', require('./controllers/collections'));
app.use('/card', require('./controllers/card'));

var server = app.listen(process.env.PORT || 3000);

module.exports = server;
