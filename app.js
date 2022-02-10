var express    = require("express"),
    mongoose   = require("mongoose"),
    app        = express(),
    bodyParser = require("body-parser"),
    passport   = require("passport"),
localStrategy  = require("passport-local"),
    flash      = require("connect-flash"),
    Campground = require("./models/campground"),
methodOverride = require("method-override"),
    Comment    = require("./models/comment"),
    User       = require("./models/user"),
    seedDB     = require("./seeds");

//requiring routes    
var commentRoutes     = require("./routes/comments"),
    campgroundRoutes  = require("./routes/campgrounds"),
    indexRoutes       = require("./routes/index");

mongoose.connect("mongodb://localhost/yelp_db_v7");

//mongoose.connect("mongodb://yelpcampdb:password@ds147789.mlab.com:47789/yelpcamp");

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

app.use(require("express-session")({
    secret:"This is best course",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(flash());

app.use(function(req, res, next){     // used for showing signed in as and whether loggedin or loggedout
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//seedDB();
/*var campgrounds = [
            {name :"Heaven's Overpass", image :"https://farm5.staticflickr.com/4113/5193321637_f6cd908e17.jpg"},
            {name :"Hanging Rock", image :"https://images.unsplash.com/photo-1445308394109-4ec2920981b1?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=1080&fit=max&s=7de12efa9efd5d176511b6caf1c99e5a"},
            {name :"Green Paddock", image:"https://images.unsplash.com/photo-1434987215074-1caeadb28cf8?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=1080&fit=max&s=a9a51ee15143440a3a518cae1561f2be"},
            {name :"Haiti", image:"https://farm2.staticflickr.com/1274/4670974422_ec49d65ab2.jpg"}
        ]  */ 

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/", indexRoutes);

app.listen(3000,process.env.IP, function(){
    console.log("The YelpCamp Server is running");
});