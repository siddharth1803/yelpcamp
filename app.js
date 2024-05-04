if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}

const express = require("express");
const app = express()
const path = require("path")
const mongoose = require("mongoose")
const methodOverride = require('method-override');
const morgan = require("morgan")
const ejsMate = require("ejs-mate")
const ExpressError = require('./utils/ExpressError');
const session = require("express-session")
const MongoStore = require("connect-mongo")
const flash = require('connect-flash');
const passport = require("passport")
const LocalStratergy = require("passport-local")
const User = require("./models/user")
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet")

const campgroundRoutes = require("./routes/campgrounds")
const reviewRoutes = require("./routes/reviews")
const userRoutes = require("./routes/users");
const uri = `mongodb+srv://${process.env.ATLAS_USER}:${process.env.ATLAS_PASS}@cluster0.janse90.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/yelp-camp`;
// const uri = "mongodb://localhost:27017/yelp-camp"
mongoose.connect(uri).then(() => {
    console.log("connected to db")
}).catch((error) => {
    console.error("Error connecting to MongoDB:", error);
})

const store = MongoStore.create({
    mongoUrl: "mongodb://localhost:27017/yelp-camp",
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});


const sessionConfig = {
    store,
    secret: "this is a secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}

// app.use(helmet({ contentSecurityPolicy: false }))
app.use(session(sessionConfig));
app.engine("ejs", ejsMate)
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));
app.use(morgan("tiny"))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStratergy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use(mongoSanitize())
app.use(flash());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.get('/', (req, res) => {
    res.render('home')
});

app.use("/", userRoutes)
app.use("/campgrounds", campgroundRoutes)
app.use("/campgrounds/:id/reviews", reviewRoutes)



app.all("*", (req, res, next) => {
    next(new ExpressError("page not found", 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (process.env.NODE_ENV == "production") {
        err.stack = ""
    }
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log("Server Running")
})
