const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../util/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {isLoggedIn, isOwner, validateReview, isReviewAuther} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");



//Review 
//Post Review Route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//Delete Review Route 
router.delete("/:reviewID", isLoggedIn, isReviewAuther, wrapAsync(reviewController.destroyReview));

module.exports = router;