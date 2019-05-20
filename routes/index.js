var express = require("express");
var router = express.Router();
var passport = require("passport");
var bodyParser = require("body-parser");
var session = require("express-session");
var LocalStrategy = require("passport-local").Strategy;
var bcrypt = require("bcrypt-nodejs");
var async = require("async");
var crypto = require("crypto");
const config = require("../config/database");
const randomstring = require("randomstring");

var mongoose = require("mongoose");

var User = require("../models/user");

router.get("/login", function(req, res) {
  res.render("login", { message: req.flash("loginMessage"), user: req.user });
});

router.get("/register", function(req, res) {
  res.render("register");
});

router.post("/register", function(req, res) {
  const username = req.body.username;
  // const username = req.body.username;
  const email = req.body.email;
  // const gender = req.body.gender;
  // const birthday = req.body.birthday;
  const phone = req.body.phone;
  //const subject = req.body.subject;
  const password = req.body.password;
  const password2 = req.body.password2;
  const usertype = req.body.usertype;

  // const Cybersecurity=req.body.{"not_checked":"false","checked":"true"};

  // var amenities = req.body.amenities;
  // Validation

  req.checkBody("username", "Username is required").notEmpty();
  req.checkBody("email", "Email is required").notEmpty();
  //req.checkBody('subject', 'Subject is required').notEmpty();
  req.checkBody("phone", "Phone Number is required").notEmpty();
  // req.checkBody('username', 'Last Name is required').notEmpty();
  // req.checkBody('gender', 'Gender is required').notEmpty();
  // req.checkBody('birthday', 'Birtday is required').notEmpty();
  req.checkBody("password", "Password is required").notEmpty();
  req.checkBody("usertype", "UserType is required").notEmpty();

  req
    .checkBody("password2", "Passwords do not match")
    .equals(req.body.password);
  // req.checkBody('category', 'Passwords do not match').notEmpty();

  // console.log(phone);
  var errors = req.validationErrors();

  if (errors) {
    res.render("register", {
      errors: errors
    });
  } else {
    //checking for email and username are already taken
    User.findOne(
      {
        username: {
          $regex: "^" + username + "\\b",
          $options: "i"
        }
      },
      function(err, user) {
        User.findOne(
          {
            email: {
              $regex: "^" + email + "\\b",
              $options: "i"
            }
          },
          function(err, mail) {
            User.findOne(
              {
                phone: {
                  $regex: "^" + phone + "\\b",
                  $options: "i"
                }
              },
              function(err, phoneno) {
                if (phoneno || mail || user) {
                  res.send(
                    `<body style="background-color:black;" ><div style="margin-top:20rem;"><h1 style="text-align:center; margin-tosubject:subject,p: 400px; background-color:black; color:red;">Already Registered Mail id or Username or Phone No </h1></div></body>`
                  );
                  // res.send(`<h1 style="text-align:center; margin-tosubject:subject,p: 400px; background-color:black; color:red;">Already Registered mail id or Username or Phone No </h1>`);
                } else {
                  // generate secret token

                  var newUser = new User({
                    username: username,
                    // birthday:birthday,
                    // gender:gender,

                    //   subject:subject,
                    email: email,
                    phone: phone,
                    password: password,
                    // username:username,
                    password2: password2,
                    usertype: usertype
                    // Cybersecurity1:Cybersecurity1
                  });
                  User.createUser(newUser, function(err, user) {
                    if (err) throw err;
                    console.log(user);
                  });
                  req.flash(
                    "success_msg",
                    "You are registered and can now login"
                  );
                  res.render("login");
                  // 	 messagebird.verify.create(phone, {
                  // 		originator : 'Code',
                  // 		template : 'Your verification code is %token.'
                  // }, function (err, response) {
                  // 		if (err) {
                  // 				// Request has failed
                  // 				console.log(err);
                  // 				res.render('register', {
                  // 						error : err.errors[0].description
                  // 				});
                  // 		} else {
                  // 				// Request was successful
                  // 				console.log(response);
                  // 				res.render('login', {
                  // 						id : response.id
                  // 				});
                  // 		}
                  // })
                  // Compose email

                  //  res.send(`<h1>Please check your email for verification</h1>`);
                  //send the email
                  // 				console.log(phone);
                  // nexmo.verify.request({
                  //   number: phone,
                  //   brand: BRAND_NAME
                  // }, (err, result) => {
                  //   if (err) {
                  //     res.sendStatus(500);
                  //   //   res.render('register', {
                  //   //     message: req.flash('Server Error')
                  //   //   });
                  //   } else {
                  //     console.log(result);
                  //     let requestId = result.request_id;
                  //     if (result.status == '0') {
                  //       res.render('verify', {
                  //         requestId: requestId
                  //       });
                  //     } else {
                  //       //res.status(401).send(result.error_text);
                  //       res.render('register', {
                  //         message: result.error_text,
                  //         requestId: requestId
                  //       });
                  //     }
                  //   }
                  // });
                }
              }
            );
          }
        );
      }
    );
  }
});

passport.use(
  "user",
  new LocalStrategy(
    {
      // by default, local strategy uses username and password, we will override with email

      passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {
      User.getUserByUsername(email, function(err, user) {
        if (err) throw err;
        if (!user) {
          return done(null, false, req.flash("loginMessage", "No user found."));
        }

        User.comparePassword(password, user.password, function(err, isMatch) {
          if (err) throw err;
          if (!isMatch) {
            return done(
              null,
              false,
              req.flash("loginMessage", "Password Does not Match.")
            );
          }

          return done(null, user);
        });
      });
    }
  )
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});
router.post(
  "/login",
  passport.authenticate("user", {
    successRedirect: "/dashboards", // redirect to the secure profile section
    failureRedirect: "/login", // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages;
  })
);

module.exports = router;
