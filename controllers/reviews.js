const Listing = require("../models/listing.js");
const Review = require("../models/review.js");


module.exports.createReview = async (req, res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await listing.save();
    await newReview.save();

    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview =async(req, res)=>{
    let {id, reviewID} = req.params;
    let listing =await Listing.findByIdAndUpdate(id, {$pull : {reviews :reviewID}});
    await Review.findByIdAndDelete(reviewID);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
}