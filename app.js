// var createError = require('http-errors');
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
// var logger = require('morgan');
const fetch = require("node-fetch");
var indexRouter = require("./routes/index");

// var adminRouter = require('./routes/admin');
// var bidRouter = require('./routes/bid');
// var companyRouter = require('./routes/company');
// var forgotRouter = require('./routes/forgots');
// var  adminauthRouter= require('./routes/adminauth');
var mongoose = require("mongoose");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var methodOverride = require("method-override");
const config = require("./config/database");
// var User= require("./models/user")

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(methodOverride("_method"));

var swig = require("swig");
app.engine("html", swig.renderFile);
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");
mongoose.connect(config.database);
let db = mongoose.connection;

// Check connection
db.once("open", function() {
  console.log("Connected to MongoDB");
});
// Check for DB errors
db.on("error", function(err) {
  console.log(err);
});
let User = require("./models/user");

// view engine setup
var swig = require("swig");
app.engine("html", swig.renderFile);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");
//Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json

app.use(methodOverride("_method"));
// Express Session Middleware
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 3600000
    }
  })
);
// Express Messages Middleware

app.use(require("connect-flash")());
app.use(function(req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});
// Express Validator Middleware
app.use(
  expressValidator({
    errorFormatter: function(param, msg, value) {
      var namespace = param.split("."),
        root = namespace.shift(),
        formParam = root;

      while (namespace.length) {
        formParam += "[" + namespace.shift() + "]";
      }
      return {
        param: formParam,
        msg: msg,
        value: value
      };
    }
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("*", function(req, res, next) {
  res.locals.user = req.user || null;
  next();
});
app.use("/", indexRouter);

// app.use('/admin', adminRouter);
// app.use('/bid', bidRouter);
// app.use('/company', companyRouter);
// app.use('/forgots', forgotRouter);
// app.use('/adminauth', adminauthRouter);

app.use(flash());

app.get("*", function(req, res) {
  // res.send('what???', 404);
  res.send(`<h1>Error</h1>`);
});
// app.use(logger('dev'));
// app.use(cookieParser());

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
