const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')

const Story = require('../models/Story')
const User = require('../models/User')

router.get('/signup', ensureGuest, (req, res) => {
  try {
    res.render('signup', {
      layout: 'signup'
    })
  } catch (err){
    console.log(err);
    res.render('error/500')
  }
})

// @desc    Login/Landing page
// @route   GET /
router.get('/', ensureGuest, (req, res) => {
  try {
    res.render('login', {
      layout: 'login',
    })
  } catch (err){
    console.log(err)
  }
})

router.get('/settings', ensureAuth, async(req, res) => {
  try {
    const {fullName, password} = res.locals.user
    res.render('settings', {
      name: fullName,
      password: password
    })
  } catch (err){
    console.log(err);
    res.render('error/500')
  }
})

router.get('/settings/profile', ensureAuth, async(req, res) => {
  try {

    const getUser = await User.findOne({
      _id: res.locals.user._id,
    }).lean()

    if(getUser){

      const {fullName, phoneNumber, email} = getUser

      res.render('profile', {
        layout: 'settings',
        fullName, 
        phoneNumber, 
        email
      })
    }
  } catch (err){
    console.log(err);
    res.render('error/500')
  }
})

// @desc    Dashboard
// @route   GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({}).lean()
    const getUser = await User.find({}).lean()

    const reportCount = stories.length
    const userCount = getUser.length

    res.render('dashboard', {
      name: req.user.firstName || req.user.fullName,
      stories,
      reportCount,
      userCount
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

module.exports = router
