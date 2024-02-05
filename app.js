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


main().then((res)=>{
    console.log("Connected to DataBase");
}).catch(err => console.log(err));

async function main(){
    mongoose.connect(MONGO_KEY);
}


app.set("view engine", "ejs");
app.set("views" , path.join(__dirname ,"views"));
app.use(express.static(path.join(__dirname , "public")));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride("_method"))
app.engine("ejs", ejsMate);


//Root Route
app.get("/", (req, res)=>{
    res.send("working")
})

// Show All Listing  Route
app.get("/listings", wrapAsync(async(req, res)=>{
    const listings = await Listing.find();
    res.render("./listings/index.ejs", {listings});
}));

// New Form Route
app.get("/listings/new", (req, res)=>{
    res.render("./listings/new.ejs");
})


// Create Route
app.post("/listings", wrapAsync(async(req, res, next )=>{
    if (!req.body.listing) {
        next(new ExpressError(400, "Send valid data to listing"))
    }
    let listing = new Listing(req.body.listing);
    await listing.save();
    console.log(listing);
    res.redirect("/listings")
}));

// Show Route
app.get("/listings/:id",wrapAsync( async (req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("./listings/show.ejs", {listing});
}));

//Edit Rout
app.get("/listings/:id/edit", wrapAsync(async (req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    console.log(listing);
    res.render("./listings/edit.ejs",{listing});
}));

//Update Route
app.put("/listings/:id", wrapAsync(async(req, res)=>{
    if (!req.body.listing) {
        next(new ExpressError(400, "Send valid data to listing"))
    }
    let {id} =req.params;
    let listing = await Listing.findByIdAndUpdate(id , {...req.body.listing}, {runValidators : true , new : true});
    res.redirect("/listings");
}));

//Delete Route
app.delete("/listings/:id", wrapAsync(async(req, res)=>{
    let {id} = req.params;
    let deletedData = await Listing.findByIdAndDelete(id); 
    res.redirect("/listings");
}));

//Error Handling :-

app.all("*",(req, res, next)=>{
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next)=>{
    let {statusCode=500 , message="Something went wrong"} = err;
    res.render("listings/error.ejs",{message});
    // res.status(statusCode).send(message);
});

app.listen(port ,()=>{
    console.log("Server is Listening to Port : ",port);
})