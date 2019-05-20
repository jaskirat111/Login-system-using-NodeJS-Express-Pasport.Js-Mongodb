const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var passportLocalMongoose= require('passport-local-mongoose');

// User Schema
const UserSchema = mongoose.Schema({

    name:{
        type: String,
        required: true
      },
      email:{
        type: String,
        required: true
      },
      phone:{
        type: String,
        required: true
      },
    //  birthday:{
    //     type: String,
    //     required: true
    //   },
    //   gender:{
    //     type: String,
    //     required: true
    //   },
      password:{
        type: String,
        required: true
      },
      password2:{
        type: String,
        required: true
      },
      usertype:{
        type: String,
        required: true
      },
  // obj = {
  //   first: req.body.1: ? true :false,
  //   second: req.body.2: ? true :false,
  //   third: req.body.3: ? true :false,
  // }
//   username:{
//     type: String,
//     required: true
//   },
  // subject:{
  //   type: String,
  //   required: true
  // }
});

// const Schema = mongoose.Schema;
// const UserDetail = new Schema({
//       username: String,
//       password: String
//     });

// const UserDetails = mongoose.model('userInfo', UserDetail, 'userInfo');
UserSchema.plugin(passportLocalMongoose)

const User = module.exports = mongoose.model('user', UserSchema);

// obj = {
//   first: req.body.1: ? true :false,
//   second: req.body.2: ? true :false,
//   third: req.body.3: ? true :false,
// };
module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
        if (err) return next(err);
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.getUserByUsername = function(email, callback){
	var query = {email: email};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}
