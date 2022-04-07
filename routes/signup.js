const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs');
const UserSignUp = require('../models/User')

router.post('/', async (req, res) => {
    try {
        const {email, phoneNumber, password, confirmPassword, fullName} = req.body

        const isRegister = await UserSignUp.findOne({
            email: email
        }).lean()

        const phoneCheck = await UserSignUp.findOne({
            phoneNumber: phoneNumber
        }).lean()

        if(!email || !password || !fullName || !confirmPassword || !phoneNumber){
            req.session.message = {
                type: 'danger',
                status: 'Gagal, ',
                message: 'Tolong isi form dengan benar'
            }
            res.redirect('/signup')
        } else if(password != confirmPassword){
            req.session.message = {
                type: 'danger',
                status: 'Gagal, ',
                message: 'Tolong isi password dengan benar'
            }
            res.redirect('/signup')
        } else if(isRegister){
            req.session.message = {
                type: 'danger',
                status: 'Gagal, ',
                message: 'Email sudah terdaftar'
            }
            res.redirect('/signup')
        } else if(phoneCheck){ 
            req.session.message = {
                type: 'danger',
                status: 'Gagal, ',
                message: 'Nomor HP sudah terdaftar'
            }
            res.redirect('/signup')
        } else {
            const saltRounds = 10;
            const myPlaintextPassword = password;
            const salt = bcrypt.genSaltSync(saltRounds);
            const hash = bcrypt.hashSync(myPlaintextPassword, salt);

            await UserSignUp.create({email: email, phoneNumber: phoneNumber, password: hash, fullName: fullName})
            req.session.message = {
                type: 'success',
                status: 'Berhasil, ',
                message: 'Silakan login.'
            }
            res.redirect('/signup')
        }

    } catch (err){
        console.error(err)
        req.session.message = {
            type: 'danger',
            intro: 'Error!, ',
            message: 'Upps ada yang error'
        }
        res.render('/signup')
    }

})
  
module.exports = router