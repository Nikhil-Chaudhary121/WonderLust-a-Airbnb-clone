const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../util/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const listingController = require("../controllers/listing.js");

const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});


router
    .route("/")
    .get(wrapAsync(listingController.index))// Show All Listing  Route
    .post(
        isLoggedIn,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.createListing)// Create Route
);

// New Form Route
router.get("/new",isLoggedIn,(listingController.renderNewForm));

router.get("/category/:type",wrapAsync( listingController.categoryList));

router.get("/search",async(req, res)=>{
    let {country} = req.query;
    let listings = await Listing.find({country : country});
    console.log(listings.length);
    if(listings.length === 0){
        req.flash("error", "Listings you requested for dose not exits!");
        return res.redirect("/listings");
    }
    res.render("./listings/searchResult.ejs", {listings});
})

router
    .route("/:id")
    .get(wrapAsync( listingController.showListing))// Show Route
    .put(
        isLoggedIn, 
        isOwner,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.updateListing))//Upadate Route
    .delete(
        isLoggedIn, 
        isOwner, 
        wrapAsync(listingController.destroyListing)//Destroy Route
);

//Edit Rout
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditFrom));



module.exports = router;