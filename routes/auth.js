const express = require('express')
const passport = require('passport')
const router = express.Router()
var randomize = require('randomatic');
const User = require('../models/User')
const Story = require('../models/Story')
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

router.post('/public', async (req, res) => {
  try {
    
  } catch (err){
    console.log(err);
  }
});

router.post('/login', async (req, res, next) => {

  const {email, password} = req.body
  

  User.findOne({email: email})
  .then(async(user) => {
    if(!user || user.password == null){
      req.session.message = {
        type: 'danger',
        intro: 'Gagal, ',
        message: 'Email atau password salah !'
      }
      res.redirect('/')
    } else {

      console.log(password, user.password)

      const passwordIsMatch = await bcrypt.compareSync(password, user.password);
      // console.log(passwordIsMatch, password, user.password)
      if(passwordIsMatch){

        passport.authenticate('local', {
          successRedirect: '/dashboard',
          failureRedirect: '/'
        })(req, res, next);

      } else {
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

router.post('/update-profile', async (req, res) => {

  try {

    let user = await User.findById(res.locals.user._id).lean()

    if (!user) {
      return res.render('error/404')
    } else {

      const {email, phoneNumber} = req.body

      const emailCheck = await User.findOne({
        email: email
      }).lean()

      const phoneCheck = await User.findOne({
        phoneNumber: phoneNumber
      }).lean()

      if(emailCheck && user.email != email){
        req.session.message = {
          type: 'danger',
          status: 'Gagal, ',
          message: 'Email telah digunakan'
        }
      } else if(phoneCheck && user.phoneNumber != phoneNumber){
        req.session.message = {
          type: 'danger',
          status: 'Gagal, ',
          message: 'Nomor HP telah digunakan'
        }
      } else {
        user = await User.findOneAndUpdate({ _id: res.locals.user._id }, req.body, {
          new: true,
          runValidators: true,
        })
        
        req.session.message = {
          type: 'success',
          status: 'Berhasil, ',
          message: 'Update Profile Berhasil'
        }
      }
      res.redirect('/settings/profile')
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }

});

router.post('/delete-account', async (req, res) => {
  try {
    const idUser = res.locals.user._id
    console.log(idUser)
    if(idUser){
      await User.remove({ _id: idUser })
      req.session.message = {
        type: 'success',
        status: 'Berhasil, ',
        message: 'Akun berhasil dihapus'
      }
      res.redirect('/')
    } else {
      req.session.message = {
        type: 'success',
        status: 'Error, ',
        message: 'Upps ada yang error'
      }
      res.redirect('/settings')
    }
  } catch (err){
    console.log(err)
    return res.render('error/500')
  }
});

router.post('/update-password', async (req, res) => {

  try {

    const {password} = res.locals.user

    const {currentPassword, newPassword, newConfirmPassword} = req.body

    if(password != null){
      const passwordIsMatch = await bcrypt.compareSync(currentPassword, password);

      if((passwordIsMatch)){
        const saltRounds = 10;
        const myPlaintextPassword = newPassword;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(myPlaintextPassword, salt);
        await User.findOneAndUpdate({ _id: res.locals.user._id }, {password: hash})
        req.session.message = {
          type: 'success',
          status: 'Berhasil, ',
          message: 'Password berhasil diubah'
        }
      } else if(!currentPassword || !newPassword || !newConfirmPassword){
        req.session.message = {
          type: 'danger',
          status: 'Gagal, ',
          message: 'Form tidak boleh kosong'
        }
      } else if(newConfirmPassword != newPassword){
        req.session.message = {
          type: 'danger',
          status: 'Gagal, ',
          message: 'Konfirmasi password tidak sesuai'
       }
      } else {
        req.session.message = {
          type: 'danger',
          status: 'Gagal, ',
          message: 'Password sekarang salah'
        }
      }
    } else {
      if(!newPassword || !newConfirmPassword){
        req.session.message = {
          type: 'danger',
          status: 'Gagal, ',
          message: 'Form tidak boleh kosong'
        }
      } else if (newPassword != newConfirmPassword){
        req.session.message = {
          type: 'danger',
          status: 'Gagal, ',
          message: 'Konfirmasi password tidak sesuai'
        }
      } else {
        const saltRounds = 10;
        const myPlaintextPassword = newPassword;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(myPlaintextPassword, salt);
        await User.findOneAndUpdate({ _id: res.locals.user._id }, {password: hash})
        req.session.message = {
          type: 'success',
          status: 'Berhasil, ',
          message: 'Password berhasil diubah'
        }
      }
    }
    res.redirect('/settings')
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }

});

router.post('/signup', async (req, res) => {
  try {
      const {email, phoneNumber, password, confirmPassword, fullName} = req.body

      const isRegister = await User.findOne({
          email: email
      }).lean()

      const phoneCheck = await User.findOne({
          phoneNumber: phoneNumber
      }).lean()

      if(!email || !password || !fullName || !confirmPassword || !phoneNumber){
          req.session.message = {
              type: 'danger',
              status: 'Gagal, ',
              message: 'Form tidak boleh kosong'
          }
      } else if(password != confirmPassword){
          req.session.message = {
              type: 'danger',
              status: 'Gagal, ',
              message: 'Konfirmasi password tidak sesuai'
          }
      } else if(isRegister){
          req.session.message = {
              type: 'danger',
              status: 'Gagal, ',
              message: 'Email sudah terdaftar'
          }
      } else if(phoneCheck){ 
          req.session.message = {
              type: 'danger',
              status: 'Gagal, ',
              message: 'Nomor HP sudah terdaftar'
          }
      } else {
          const saltRounds = 10;
          const myPlaintextPassword = password;
          const salt = bcrypt.genSaltSync(saltRounds);
          const hash = bcrypt.hashSync(myPlaintextPassword, salt);

          await User.create({email: email, phoneNumber: phoneNumber, password: hash, fullName: fullName})
          req.session.message = {
              type: 'success',
              status: 'Berhasil, ',
              message: 'Silakan login.'
          }
      }
      res.redirect('/signup')
  } catch (err){
      console.error(err)
      req.session.message = {
          type: 'danger',
          intro: 'Error!, ',
          message: 'Upps ada yang error'
      }
      res.redirect('/signup')
  }
})

router.post('/report', async (req, res) => {
  try {
    const reportId = `OK${randomize('A0', 5)}`
    const {fullName, phoneNumber, address, reports} = req.body

    console.log(fullName, phoneNumber, address, reports)

    if(fullName || phoneNumber || address || reports){
      await Story.create({fullName: fullName, phoneNumber: phoneNumber, address: address, idReport: reportId, reports: reports})
      .then(res => {
        req.session.message = {
          type: 'success',
          status: 'Berhasil, ',
          message: `Pengaduan berhasil dibuat dengan ID Laporan ${reportId}`
        }
      })
      .catch(err => {
        console.log(err)
      })
    } else {
      req.session.message = {
        type: 'danger',
        status: 'Gagal, ',
        message: `Pengaduan gagal dibuat`
      }
    }

    res.redirect('/report')

  } catch (error) {
    console.log(error)
  }
})

router.post('/track', async(req, res) => {
  try {
    const {reportId} = req.body
    let findIdReport = await Story.findOne({idReport: reportId}).lean()
    if(findIdReport){
      req.session.message = {
        type: 'success',
        status: 'Berhasil, ',
        message: `ID Laporan ditemukan`,
        fullName: findIdReport.fullName,
        reportStatus: findIdReport.reportStatus,
        phoneNumber: findIdReport.phoneNumber,
        address: findIdReport.address,
        idReport: findIdReport.idReport,
        reports: findIdReport.reports,
        additional: findIdReport.additional
      }
    } else {
      req.session.message = {
        type: 'danger',
        status: 'Gagal, ',
        message: `ID Laporan tidak ditemukan`
      }
    }
    res.redirect('/track')
  } catch (error) {
    console.log(error)
  }
});
// @desc    Logout user
// @route   /auth/logout
router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

module.exports = router
