const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/user');

passport.use(new LocalStrategy(
    function(username, email, done) {

        User.findOne({ email: email }, function(err, user) {
            if (err) {
                console.log('Error in finding User :: Passport');
                return done(null);
            }

            if (user.password != this.password) {
                console.log('Invalid UserName & Password');
                return done(null, false);
            }


        })
    }));

//serializing the user to decide which key is to be kept in the cookies

passport.serializeUser(function(user, done) {
    done(null, user.id); //automatically encrpyts
});

//deserializxing the user from the key in the cookies
passport.deserializeUser(function(id, done) {
    User.findById(function(err, user) {
        if (err) {
            console.log('Error in finding User');
            return done(err, user);
        }
    })
});


module.exports = passport;