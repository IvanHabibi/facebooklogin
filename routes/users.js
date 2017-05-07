var express = require('express');
var router = express.Router();
var userController = require("../controllers/userController")
const passport = require('passport');


router.post('/signup', userController.signUp);
router.post('/signin', passport.authenticate('local', { session: false }), userController.sendToken);
router.get('/', userController.getAllUser);
router.get('/:id', userController.getOneUser)
router.post('/', userController.insertUser);
router.put('/:id', userController.updateUser)
router.delete('/:id',userController.deleteUser)

// Facebook routes
router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

router.get('/auth/facebook/callback', passport.authenticate('facebook'));
// router.get('/auth/facebook/callback', passport.authenticate('facebook', {
//   successRedirect: '/users/profile',
//   failureRedirect: '/users/',
// }));

// router.get('/auth/facebook/callback',
//   passport.authenticate('facebook', { failureRedirect: '/login' }),
//   function(req, res) {
//     console.log(req);
//     res.send({msg:'YEAY'})
//
//   });
// router.get('/profile',
//   function(req, res){
//     console.log('========================');
//     // res.render('profile', { user: req.token });
//     console.log(req.user);
//     res.send({msg:'berhasil'});
// });

module.exports = router;
