const Listing = require("../models/listing.js");

module.exports.index = async(req, res)=>{
    const listings = await Listing.find();
    res.render("./listings/index.ejs", {listings});
};

module.exports.renderNewForm = (req, res)=>{
    res.render("./listings/new.ejs");
}

module.exports.showListing = async (req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id)
    .populate({
        path : "reviews",
        populate : {
            path : "author",
        },
      })
      .populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for dose not exits!");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs", {listing});
}

module.exports.createListing =  async(req, res, next )=>{
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(req.body.listing);
    let newListing = new Listing(req.body.listing)
    newListing.owner = req.user._id;
    newListing.image = {url , filename};
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}

module.exports.categoryList = async (req, res)=>{
    let {type} = req.params;
    let listings = await Listing.find({catagory : type});
    if(!listings){
        req.flash("error", "Listings you requested for dose not exits!");
        return res.redirect("/listings");
    }
    res.render("./listings/category.ejs", {listings});
}

module.exports.renderEditFrom = async (req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for dose not exits!");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("./listings/edit.ejs",{listing , originalImageUrl});
}

module.exports.updateListing = async(req, res)=>{
    let {id} =req.params;
    let listing = await Listing.findByIdAndUpdate(id , {...req.body.listing}, {runValidators : true , new : true});
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url , filename};
        await listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect("/listings");
}

module.exports.destroyListing = async(req, res)=>{
    let {id} = req.params;
    let deletedData = await Listing.findByIdAndDelete(id); 
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}