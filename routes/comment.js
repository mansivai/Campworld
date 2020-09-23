var express =require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");
var middleware = require("../middleware");
//-----------------------------------------------------------------------------------------------------------------------------------------
//NEW ROUTE
router.get("/new" ,middleware.isloggedIn, function(req , res){
	//find by id
	Campground.findById(req.params.id , function(err , foundcampground){
		if(err){
			console.log("error");
		} else{
			res.render("comments/new" , { campgound : foundcampground});
		}
	})	
});
//CREATE ROUTE
router.post("/" , middleware.isloggedIn,function(req , res){
	//lookup  campground using the ID
	Campground.findById(req.params.id , function(err , foundcampground){
		if(err){
			console.log("error");
			res.redirect("/campgrounds");
		} else{
			//create new comments
			Comment.create(req.body.comment , function( err , comment){
				if(err){
				console.log("error");
			} else{
				//add username and id to comment//save comment
				comment.author.id = req.user._id ;
				comment.author.username = req.user.username ;
				comment.save();
				foundcampground.comments.push(comment);
				foundcampground.save();
				req.flash("success" , "Successfully added a ccomment");
				res.redirect("/campgrounds/"+foundcampground._id);
				
			}
				
			});
			//connect new comment to campground
			//redirect campgorund show page	
		}
	})	
});

//EDIT ROUTE
//EDIT CAMPGROUND
router.get("/:comment_id/edit",middleware.checkCommentOwnership , function(req, res){
 	Comment.findById(req.params.comment_id , function(err , foundcomment){
		if(err){ res.redirect("/campgorunds");}else
		{res.render("comments/edit" , { campground_id: req.params.id ,comment: foundcomment});	}
});
});

//UPDATE ROUTE
router.put("/:comment_id",middleware.checkCommentOwnership , function(req,res){
	// res.send("commentbeingupdated");
	Comment.findByIdAndUpdate( req.params.comment_id , req.body.comment , function(err , foundcomment){
		if(err){res.redirect("/campgorunds");}else{
			req.flash("info" , "Comment updated!!");
			res.redirect("/campgrounds/"+ req.params.id );
		}
	})
});


//DELETE ROUTE
router.delete("/:comment_id" ,middleware.checkCommentOwnership ,function(req, res){
	//destroy
	Comment.findByIdAndRemove(req.params.comment_id , function(err){
		if(err){
			res.redirect("/campgrounds/"+ req.params.id );
		} else{
			req.flash("info" , "Successfully deleted a comment");
			res.redirect("/campgrounds/"+ req.params.id  );
		}
	});
})
//==================================================================
// function isloggedIn(req , res , next){
// 	if(req.isAuthenticated()){
// 		return next();
// 	}
// 	res.redirect("/login");
// };
//*******************************************************************
// function checkCommentOwnership(req , res , next){
// 	if(req.isAuthenticated()){
// 		Comment.findById(req.params.comment_id , function(err , foundcomment){
// 			if(err){
// 				res.redirect("/campgrounds/" +req.params.id);
// 			 } else{
// 				//does the user own the campgrounds		
// 			//    object   (cannot use ==/===)     string
// 			if(foundcomment.author.id.equals(req.user._id)){
// 			   next();	
// 			} else{
// 				console.log("you need permission to do that");
// 			   res.redirect("back");
// 			   };
				
// 			 }
// 		});
// 	} 
// 	else{
// 		res.redirect("/login");
// 	}
// };


module.exports= router;