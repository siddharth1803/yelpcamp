var middlewareObj ={};
var Campground = require("../models/campground");
var Comment = require("../models/comment");
middlewareObj.checkCampgroundOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err,foundCampground){
            if(err){
                req.flash("error","Campground not found");
                res.redirect("back");
            }else{
                //does user own campground
                console.log(foundCampground.author.id); // this id is mongoose object
                console.log(req.user._id); // this is is string
                var authorId = foundCampground.author.id.toString();
                var userId = req.user._id.toString();
                //does user own the campground
                if(authorId === userId){
                    next();
                }else{
                    req.flash("error","You dont have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error","You need to be loggedin to do that");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            }else{
                var commentId = foundComment.author.id.toString();
                var userId = req.user._id.toString();
                if(userId === commentId){
                    next();
                }else{
                    req.flash("error","You dont have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error","You need to be loggedin to do that");
        res.redirect("back"); 
    }
}

middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{ 
        req.flash("error","Please Login First!"); //key value pair
        res.redirect("/login");
    }
}

module.exports = middlewareObj;