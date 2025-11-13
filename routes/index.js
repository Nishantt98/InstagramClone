var express = require('express');
var router = express.Router();
var UserModel = require('./users')
var PostModel = require('./post')
const passport = require('passport');
const upload = require('./multer');


//in do line se user login hota hai
const localStrategy = require("passport-local");
const post = require('./post');
passport.use(new localStrategy(UserModel.authenticate()))

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/login', function(req, res, next) {
  res.render('login',{error:req.flash("error")});
});

router.get('/feed', function(req, res, next) {
  res.render('feed');
});

router.post('/upload',isLoggedIn, upload.single("file"),async function(req, res, next) {
  if(!req.file){
    return res.status(400).send("NO file Were Uploaded")
  }
  const user = await UserModel.findOne({username:req.session.passport.user})
  const post = await PostModel.create({
    image: req.file.filename,
    imageText: req.body.filecaption,
    user:user._id
  })
  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile")
});

router.get('/profile',isLoggedIn,async function(req, res, next) {
  const user = await UserModel.findOne({
    username:req.session.passport.user
  }).populate("posts");
  res.render('profile',{user})
});

router.post('/registor',function(req,res){
  // let userData = new UserModel({
  //       username:req.body.username,     //own code
  //       email:req.body.email,
  //       fullName:req.body.fullName,
  // })

  const { username, email, fullName } = req.body;
  let userData = new UserModel({ username, email, fullName });//short by chatgpt

  UserModel.register(userData,req.body.password)
  .then(function(){
    passport.authenticate("local")(req,res,function(){
      res.redirect("/profile")
    })
  })
})

router.post('/login',passport.authenticate("local",{
    successRedirect:"/profile",
    failureRedirect:"/login",
    failureFlash:true,
}),function(req,res){
});

router.get("/logout",function(req,res){
  req.logout(function(err){
    if(err){return next(err);}
      res.redirect('/');
  });
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()) return next();
  res.redirect("/login");
}


module.exports = router;
