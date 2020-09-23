//basic setup
var express =require("express");
	app = express(),
	bodyParser = require("body-parser"),
	passport =require("passport"),
	localStrategy = require("passport-local"),
	methodoverride = require("method-override"),
	passportlocalmongoose = require("passport-local-mongoose"),
	flash = require("connect-flash"),
	User = require("./models/user.js");
	middleware = require("./middleware")
//expressSanitizer
var expressSanitizer = require("express-sanitizer");
app.use(expressSanitizer());
//moment===========================
// const moment = require('moment');
// console.log(moment().format());
app.locals.moment=require("moment");

//mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/yelp_camp_v5', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

//dependencies
var campgroundRoutes = require("./routes/campground"),
	commentRoutes    = require("./routes/comment"),
	authRoutes 	     = require("./routes/index");

app.set("view engine" , "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodoverride("_method"));

//requiring campgrounds===============================
var Campground = require("./models/campgrounds");
var Comment = require("./models/comment");
var seedDB = require("./seeds");
//====================================================
//seedDB(); //seed the database
//flash
app.use(flash());

//PASSPORT CONFIG
app.use(require("express-session")({
	secret:"cats are the seroiously worst",
	resave: false ,
	saveUninitialized: false
	
}));

app.use(passport.initialize());
app.use(passport.session());
//=================================
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




//our own middleware
//==================================

app.use(function(req , res , next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	res.locals.info = req.flash("info");
	next();
});

//====================================
app.use("/campgrounds" ,campgroundRoutes);
app.use(authRoutes);
app.use("/campgrounds/:id/comments" ,commentRoutes);

//server
app.listen(2900, function() { 
  console.log('Server listening on port 2900'); 
});