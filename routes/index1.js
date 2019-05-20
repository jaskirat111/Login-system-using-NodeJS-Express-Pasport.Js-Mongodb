var express = require("express");
var router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
// require('../config/passport')(passport)
const bodyParser = require("body-parser");
const LocalStrategy = require("passport-local").Strategy;
var methodOverride = require("method-override");
var mongoose = require("mongoose");
const session = require("express-session");
require("dotenv").config();
var async = require("async");
var crypto = require("crypto");
const config = require("../config/database");
// var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const Nexmo = require("nexmo");
const BRAND_NAME = process.env.NEXMO_BRAND_NAME;
const NEXMO_API_KEY = process.env.NEXMO_API_KEY;
const NEXMO_API_SECRET = process.env.NEXMO_API_SECRET;
const nexmo = new Nexmo({
  apiKey: "08bc89c4",
  apiSecret: "D7nhE3URsHSGUf5E"
});
router.get("/", function(req, res, next) {
  res.render("index", { title: "findmycowark" });
});
router.get("/blog", function(req, res, next) {
  res.render("blog", { title: "blog" });
});

router.get("/login", function(req, res, next) {
  res.render("login", { title: "login" });
});
