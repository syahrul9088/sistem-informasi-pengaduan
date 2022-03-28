const express = require('express')
const router = express.Router()
const UserSignUp = require('../models/User')

router.post('/', async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password
        const confirmPassword = req.body.confirmPassword
        const fullName = req.body.fullName

        const isRegister = await UserSignUp.findOne({
            email: email,
        }).lean()

        if(email == '' || password == '' || fullName == '' || confirmPassword == ''){
            req.session.message = {
                type: 'danger',
                intro: 'Form kosong!',
                message: 'Tolong isi form dengan benar'
            }
            res.redirect('/signup')
        } else if(password != confirmPassword){
            req.session.message = {
                type: 'danger',
                intro: 'Password tidak sama!',
                message: 'Tolong isi password dengan benar'
            }
            res.redirect('/signup')
        } else if(isRegister){
            req.session.message = {
                type: 'danger',
                intro: 'Email',
                message: 'sudah terdaftar'
            }
            res.redirect('/signup')
        } else {
            await UserSignUp.create({email, password, fullName})
            req.session.message = {
                type: 'success',
                intro: 'Berhasil mendaftar!',
                message: 'Silakan login.'
            }
            res.redirect('/signup')
        }

    } catch (err){
        console.error(err)
        req.session.message = {
            type: 'danger',
            intro: 'Error!',
            message: 'Upps ada yang error'
        }
        res.render('/signup')
    }

})
  
module.exports = router