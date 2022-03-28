const express = require('express')
const passport = require('passport')
const router = express.Router()
const User = require('../models/User')

// @desc    Auth with Google
// @route   GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }))

// @desc    Google auth callback
// @route   GET /auth/google/callback

// router.post('/', passport.authenticate('local', {
  
  
// 	// successRedirect: '/',
// 	// failureRedirect: '/signup?error=true'
// }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/dashboard')
  }
)

// router.post('/', async(req, res) => {
//   const username = req.body.username
//   const password = req.body.password

//   const checkUser = await User.findOne({
//     email: username
//   })

//   console.log(checkUser)

//   if(!checkUser){
//     res.render('login', {
//       layout: 'login',
//     })
//   } else {
   
//   }
// })

// @desc    Logout user
// @route   /auth/logout
router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

module.exports = router
