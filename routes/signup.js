const express = require('express')
const router = express.Router()
const UserSignUp = require('../models/User')

router.post('/', async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password
        const fullName = req.body.fullName

        if(email && password && fullName){
            await UserSignUp.create({email, password, fullName})
            res.redirect('/signup')
        } else {
            res.redirect('/signup')
        }
    } catch (err){
        console.error(err)
        res.render('error/500')
    }

})
  
module.exports = router