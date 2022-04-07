const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')

const Story = require('../models/Story')
const User = require('../models/User')

router.get('/signup', ensureGuest, (req, res) => {
  res.render('signup', {
    layout: 'signup'
  })
})

// @desc    Login/Landing page
// @route   GET /
router.get('/', ensureGuest, (req, res) => {
  res.render('login', {
    layout: 'login',
  })
})

// router.get('/setting', ensureAuth, async(req, res) => {
//   res.render('setting', {
//     layout: 'setting',
//   })
// })

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
