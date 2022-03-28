const GoogleStrategy = require('passport-google-oauth20').Strategy
const localStrategy		= require('passport-local').Strategy;
const mongoose = require('mongoose')
const User = require('../models/User')

module.exports = function (passport) {


  // passport.use(new localStrategy(function (username, password, done) {
  //   User.findOne({ username: username }, function (err, user) {
  //     if (err) return done(err);
  //     if (!user) return done(null, false, { message: 'Incorrect username.' });
  
  //     bcrypt.compare(password, user.password, function (err, res) {
  //       if (err) return done(err);
  //       if (res === false) return done(null, false, { message: 'Incorrect password.' });
        
  //       return done(null, user);
  //     });
  //   });
  // }));

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {

        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value
        }

        try {
          let user = await User.findOne({ googleId: profile.id })

          if (user) {
            done(null, user)
          } else {
            user = await User.create(newUser)
            done(null, user)
          }
        } catch (err) {
          console.error(err)
        }
      }
    )
  )

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user))
  })
}