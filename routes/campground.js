var express =require("express");
var methodoverride = require("method-override");
var expressSanitizer = require("express-sanitizer");
app.use(expressSanitizer());
var router = express.Router();
var Campground = require("../models/campgrounds");
app.use(methodoverride("_method"));
var middleware = require("../middleware");
//-----------------------------------------------------------------------------------------------------------------------------------------
//INDEX ROUTE
//here goes the campground
router.get("/", function(req , res){
	var noMatch = null;
	if(req.query.search){
       const regex = new RegExp(escapeRegex(req.query.search), 'gi');
		Campground.find({name : regex},function(err, allcampgrounds){
		if(err){
			console.log(err);
		} else{
			
			if(allcampgrounds.length < 1){
				noMatch = "No such campground exists , try again!"
			}
			// console.log("---------------------------");
			// console.log(noMatch);
			res.render("campgrounds/index.ejs",{campground : allcampgrounds , noMatch : noMatch});
		}


	});
	} else{
		Campground.find({},function(err, allcampgrounds){
		if(err){
			console.log("ohh nooo! got an error")
		} else{
			res.render("campgrounds/index.ejs",{campground : allcampgrounds , noMatch: noMatch});
		}


		});
	}
	// eval(require("locus"));
	// get all campground from mongodb
    

	
});

//post
//get data from the form and add to the campground array
//redirect back to the campgrounds page

//CREATE ROUTE
router.post("/" , middleware.isloggedIn,function(req, res){
	//create a new cg and save to db
	var name = req.body.name;
	var image = req.body.image;
	var price = req.body.price;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	} ;
	var newCampground = { name: name ,price:price , image: image, description: description , author:author};
	Campground.create(newCampground,function(err, camp){
	if(err){
		console.log(err);
	} else{
		// camp.author.id = req.user._id;
		// camp.auhtor.username = req.user.username;
		// camp.save();
		//redirect to hte campground page
		req.flash("info" , "Successfully added a campground");

		res.redirect("campgrounds");
	}
});
	
})
//NEW- SHOW FORM
router.get("/new" ,middleware.isloggedIn, function(req, res){
	res.render("campgrounds/new");
	
});

//SHOW ROUTE
router.get("/:id" , function(req, res){
	//find the campground with provided id 
	Campground.findById(req.params.id).populate("comments").exec(function(err , foundCampgrpond){
		if(err){
			console.log(err);
		} else{
		//render the show template with that campground
	    res.render("campgrounds/show" ,{ campground: foundCampgrpond});	
		}
	});

});

//EDIT CAMPGROUND
router.get("/:id/edit" ,middleware.checkCampgroundOwnership, function(req, res){
 	Campground.findById(req.params.id , function(err , foundcampground){
		res.render("campgrounds/edit" , {campground: foundcampground});	
});
});

//UPDATE CAMPGROUND
//UPDATE
router.put("/:id",middleware.checkCampgroundOwnership, function(req,res){
	req.body.campground.body = req.sanitize(req.body.campground.body);
	Campground.findByIdAndUpdate(req.params.id ,req.body.campground, function(err , foundcampground){
		if(err){
			console.log(err);
			req.flash("error" , "something went wrong");
			res.redirect("/campgrounds");
		} else{
			req.flash("info" , "Campground updated!!");
			res.redirect("/campgrounds/"+ req.params.id );
		}
	});

});
//DELETE
router.delete("/:id" , middleware.checkCampgroundOwnership ,function(req, res){
	//destroy
	Campground.findByIdAndRemove(req.params.id , function(err){
		if(err){
			req.flash("error" , "something went wrong");
			res.redirect("/campgrounds")
		} else{
			req.flash("info" , "Successfully deleted a campground");
			res.redirect("/campgrounds" );
		}
	});
})



// function isloggedIn(req , res , next){
// 	if(req.isAuthenticated()){
// 		return next();
// 	}
// 	res.redirect("/login");
// };

// function checkCampgroundOwnership(req , res , next){
// 	if(req.isAuthenticated()){
// 		Campground.findById(req.params.id , function(err , foundcampground){
// 			if(err){
// 				res.redirect("/campgrounds");
// 			 } else{
// 				//does the user own the campgrounds		
// 			//    object   (cannot use ==/===)     string
// 			if(foundcampground.author.id.equals(req.user._id)){
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
function escapeRegex(text){
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports= router;
