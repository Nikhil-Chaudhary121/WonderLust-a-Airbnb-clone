if(process.env.NODE_ENV != "production") {
    require("dotenv").config();
}
// console.log(process.env);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const port = 8080;
const Listing = require("./models/listing");
const data = require("./init/data");
const MONGO_KEY = "mongodb://127.0.0.1:27017/wanderlust";
const path = require("path");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./util/wrapAsync.js");
const ExpressError = require("./util/ExpressError.js");
const {reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");


const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/reviews.js");
const usersRouter = require("./routes/user.js")


main().then((res)=>{
    console.log("Connected to DataBase");
}).catch(err => console.log(err));

async function main(){
    mongoose.connect(MONGO_KEY);
}

const sessionOption = {
    secret : "mysecretcode",
    resave : false,
     saveUninitialized : true,
     cookie: {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge :  7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
     }
}

app.set("view engine", "ejs");
app.set("views" , path.join(__dirname ,"views"));
app.use(express.static(path.join(__dirname , "public")));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride("_method"))
app.engine("ejs", ejsMate);



app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

// app.get("/demouser", async(req, res)=>{
//     let fakeUser = new User({
//         email : "nikhil@gmail.com",
//         username : "nikhil-chaudhary"
//     });
//     let registeredUser = await User.register(fakeUser , "helloworld");
//     res.send(registeredUser);
// })

app.use("/listings", listingsRouter);
app.use("/listings/:id/review", reviewsRouter);
app.use("/", usersRouter);

//Error Handling :-

app.all("*",(req, res, next)=>{
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next)=>{
    let {statusCode=500 , message="Something went wrong"} = err;
    res.status(statusCode).render("listings/error.ejs",{message});        
    // res.status(statusCode).send(message);
});

app.listen(port ,()=>{
    console.log("Server is Listening to Port : ",port);
})