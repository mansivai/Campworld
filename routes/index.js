var express =require("express");
var	passport =require("passport");
var	User = require("../models/user");
var router = express.Router();
var Campground = require("../models/campgrounds")

//-----------------------------------------------------------------------------------------------------------------------------------------	
//here goes the lanidng page
router.get("/", function(req , res){
	res.render("./campgrounds/landing");
	req.flash("success" , "Welcome to Yelpcamp");
	
})
//AUTH ROUTES

//show register form
router.get("/register" , function(req , res){
	res.render("register");
});
//handle sign up logic
router.post("/register" , function(req , res){
	//we dont save the password to the database here
	var newUesr =new User({username :req.body.username,
						  email: req.body.email ,
						  avatar:req.body.avatar});
	if(req.body.admincode === "code123"){
		newUesr.isAdmin = true;
	};
	User.register( newUesr, req.body.password , function(err , user){
		if(err){
			
			
			return res.render("register" ,{error:err.message});
		} 
		passport.authenticate("local")(req , res , function(){
			req.flash("success" , "Successfully registered , Welcome to YelpCamp " + req.body.username);
			res.redirect("/campgrounds");
		});
		
	});
})

//LOGIN ROUTES
router.get("/login" , function(req, res){
	res.render("login");
	
});
//login logic 
//middleware
router.post("/login" ,passport.authenticate("local",{
	successRedirect:"/campgrounds",
	failureRedirect:"/login"
}), function(req , res){	
});


//logout
router.get("/logout" , function(req , res){
	req.logout();
	req.flash("info" , "Logged out");
	res.redirect("/");
});

//********************************************
//user profile
router.get("/user/:id", function(req , res){
	User.findById(req.params.id , function(err , founduser){
		if(err){
			req.flash("error" ,"something went wrong");
			res.redirect('/campgrounds') ;
		}
		Campground.find().where("author.id").equals(founduser._id).exec(function(err , campgrounds){
			if(err){
			req.flash("error" ,"something went wrong");
			res.redirect('/campgrounds') ;
		}
			res.render("user/show" ,{user :founduser , campground :campgrounds});
		})
		
	
	  });
});

//==================================================================
module.exports= router;