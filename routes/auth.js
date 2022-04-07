const express = require('express')
const passport = require('passport')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs');

// @desc    Auth with Google
// @route   GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'] }))

// router.get('/local', passport.authenticate('local', { scope: ['user'] }))

// @desc    Google auth callback
// @route   GET /auth/google/callback

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/dashboard')
  }
)

router.post('/doLogin', async (req, res, next) => {

  const {email, password} = req.body

  User.findOne({email: email})
  .then(async(user) => {
    if(!user){
      req.session.message = {
        type: 'danger',
        intro: 'Gagal, ',
        message: 'Email atau password salah !'
      }
      res.redirect('/')
    } else {
      const passwordIsMatch = await bcrypt.compareSync(password, user.password);
      // console.log(passwordIsMatch, password, user.password)
      if(passwordIsMatch){

        passport.authenticate('local', {
          successRedirect: '/dashboard',
          failureRedirect: '/'
        })(req, res, next);
        // console.log('password benar')

      } else {
        // console.log('password salah')
        req.session.message = {
          type: 'danger',
          intro: 'Gagal, ',
          message: 'Email atau password salah !'
        }
        res.redirect('/')
      }
    }
  })
});

// @desc    Logout user
// @route   /auth/logout
router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

module.exports = router
