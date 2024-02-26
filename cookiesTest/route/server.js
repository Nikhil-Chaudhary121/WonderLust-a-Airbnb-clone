const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine", "ejs");
app.set("views" , path.join(__dirname ,"views"));


const sessionOption = {
    secret : "mysecretcode",
    resave : false,
     saveUninitialized : true
}

app.use(session(sessionOption));
app.use(flash());
app.use((req, res, next)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
})

app.get("/register", (req , res)=>{
    let {name = "anonymous"} = req.query;
    req.session.name = name;
    if (req.session.name === "anonymous") {
        req.flash("error", "user not registered ");    
    } else {
        req.flash("success", "user registered successfully!");
    }
    res.redirect("/hello")
})

app.get("/hello", (req , res)=>{
    
    res.render("page.ejs", {name : req.session.name})})

// app.get("/reqcount",(req , res)=>{
//    if (req.session.cnt) {
//     req.session.cnt++ ;
//    } else {
//     req.session.cnt = 1;
//    }
//     res.send(`You send the request here ${req.session.cnt} times`)
// })

app.listen(8000, ()=>{
    console.log("Server is listing on port 8000")
})