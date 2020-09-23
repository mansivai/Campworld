var Campground = require("../models/campgrounds.js");
var Comment = require("../models/comment.js")
var middlewareObj ={};

//all the middle ware goes here

middlewareObj.checkCampgroundOwnership = function(req , res , next){
		if(req.isAuthenticated()){
			Campground.findById(req.params.id , function(err , foundcampground){
				if(err){
					res.redirect("/campgrounds");
				 } else{
					//does the user own the campgrounds		
				//    object   (cannot use ==/===)     string
				if(foundcampground.author.id.equals(req.user._id) || req.user.isAdmin){
					
				   next();	
				} else{
					console.log("you need permission to do that");
					req.flash("info" , "You don't have the permission to do that");
				   res.redirect("back");
				   };

				 }
			});
		} 
		else{
			
			res.redirect("/login");
		}
};

middlewareObj.checkCommentOwnership = function(req , res , next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id , function(err , foundcomment){
			if(err){
				req.flash("info" , "Commnet doesn't exist ");
				res.redirect("/campgrounds/" +req.params.id);
			 } else{
				//does the user own the campgrounds		
			//    object   (cannot use ==/===)     string
			if(foundcomment.author.id.equals(req.user._id)|| req.user.isAdmin){
			   next();	
			} else{
				console.log("you need permission to do that");
				req.flash("info" , "You don't have the permission to do that");
			    res.redirect("back");
			   };
				
			 }
		});
	} 
	else{
		req.flash("error" , "You need to be logged in to do that");
		res.redirect("/login");
	}
};


middlewareObj.isloggedIn =function(req , res , next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error" , "You need to be logged in to do that");
	res.redirect("/login");
};



module.exports = middlewareObj ;