const ExpressError = require("./util/ExpressError.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");


module.exports.isLoggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in!");
        return res.redirect("/login");
    }else{
        next();
    }
}

module.exports.saveRedirect = (req, res ,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req, res, next)=>{
    let {id} =req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the Owner!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req, res, next)=>{
    let {error} = listingSchema.validate(req.body); 
    if (error) {
        let errMsg = error.details.map((el) => el.message);
        console.log(errMsg);
        throw new ExpressError(400, error);
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next)=>{
    let {error} = reviewSchema.validate(req.body); 
    if (error) {
        let errMsg = error.details.map((el) => el.message);
        console.log(errMsg);
        throw new ExpressError(400, error);
    } else {
        next();
    }
}

module.exports.isReviewAuther = async(req, res, next)=>{
    let {id, reviewID} =req.params;
    
    let review = await Review.findById(reviewID);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the Author of this Review!");
        return res.redirect(`/listings/${id}`);
    }else{
        next();
    }
}
