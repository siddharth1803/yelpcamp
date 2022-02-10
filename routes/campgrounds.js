var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
router.get("/", function(req,res){
        Campground.find({},function(err,allCampgrounds){
            if(err){
                console.log(err);
            }else{
                res.render("campgrounds/campgrounds",{campgrounds:allCampgrounds});    
            }
        });
});
//CREATE ADD NEW CAMPGROUND
router.post("/",middleware.isLoggedIn, function(req,res){
   var newcamp = req.body.addnew;
   var price = req.body.price;
   var image = req.body.image;
   var description = req.body.description;
   var author = {
       id:req.user._id,
       username:req.user.username
   };
   var newCampground = {name:newcamp , price:price, image:image, description:description, author:author};
   //create new campground and save to DB
   Campground.create(newCampground, function(err,newlyCreated){
       if(err){
           console.log(err);
       }else{
           console.log(newlyCreated);
           res.redirect("/campgrounds");
       }
   });
});
//NEW  - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});
//SHOW more info about one campground
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err,showCampground){
        if(err){
            console.log(err);
        }else{
            //render show template with that campground
            console.log(showCampground);
            //res.json(showcampground);
            res.render("campgrounds/show",{campground:showCampground});
        }
    });
});
//EDIT Campground Route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) { // middleware is called before we go to route handler
        Campground.findById(req.params.id, function(err,foundCampground){
                if(err){
                    console.log(err);
                }else{
                res.render("campgrounds/edit",{campground: foundCampground}); 
                }
        });
    //otherwise redirect
    //if not redirect
});

//UPDATE Campground route
router.put("/:id",middleware.checkCampgroundOwnership, function(req, res) {
    
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/" + req.params.id); // instead of req.params.id , can also be done updatedCampground._id 
        }   
    });
    //redirect somewhere(show page)
})
//DESTROY Campground Route
router.delete("/:id",middleware.checkCampgroundOwnership, function(req,res){   // actaul destroy route -> campgrounds/:id
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    })
})

module.exports = router;