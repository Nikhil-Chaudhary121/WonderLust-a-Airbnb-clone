const User = require("../models/user");
// const passport = require("passport");
// const { saveRedirect } = require("../middleware");


module.exports.renderSignUpForm =(req, res)=>{
    res.render("./users/signup.ejs")
}

module.exports.signUp = async(req, res)=>{
    try {
        let {username , email , password} = req.body;
        let newUser = new User({email , username});
        let registeredUser = await User.register(newUser , password);
        console.log(registeredUser);
        req.logIn(registeredUser, (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to WanderLust!");
            res.redirect("/listings");
        })
        
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm =(req, res)=>{
    res.render("./users/login.ejs")
}

module.exports.login = async(req, res)=>{
    req.flash("success", "Welcome back on Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    console.log(redirectUrl);
    res.redirect(redirectUrl);
}

module.exports.logout =  (req, res, next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "You are logged out!")
        res.redirect("/listings");
    })
}