const express = require("express");
const User = require("../models/user");
const wrapAsync = require("../util/wrapAsync");
const router = express.Router({mergeParams : true});
const passport = require("passport");
const { saveRedirect } = require("../middleware");

const userController = require("../controllers/users");

router
    .route("/signup")
    .get(userController.renderSignUpForm) // SignUp Form
    .post(wrapAsync(userController.signUp) // SignUP 
);

router
    .route("/login")
    .get(userController.renderLoginForm)// Login Form
    .post(saveRedirect, passport.authenticate("local",{ //Login
        failureRedirect : "/login",
        failureFlash : true
    }) ,userController.login
);

//Logout Route
router.get("/logout",userController.logout)

module.exports = router;