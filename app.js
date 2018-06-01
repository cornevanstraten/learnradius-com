//CR prototype app.js
var sslRedirect = require('heroku-ssl-redirect'),//SSL
    express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    bodyParser  = require("body-parser"),
    flash       = require("connect-flash"),
    passport            = require("passport"),
    LocalStrategy       = require("passport-local"),
    methodOverride      = require("method-override"),
    Circle      = require("./models/circle"),
    Review      = require("./models/review"),
    Endorsement = require("./models/endorsement"),
    User        = require("./models/user"),
    Agreement   = require("./models/agreement")


//requiring ROUTES
var indexRoutes         = require("./routes/index");
var circleRoutes        = require("./routes/circles.js");
var reviewRoutes        = require("./routes/reviews.js");
var endorsementRoutes   = require("./routes/endorsements.js");
var agreementRoutes     = require("./routes/agreements.js");

var url = process.env.DATABASEURL || "mongodb://localhost/cr_prototype"

mongoose.connect(url, {useMongoClient: true})
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs")
//Tell our app to serve the public directory 
app.use(express.static(__dirname + "/public"));
app.use(sslRedirect());
app.use(methodOverride("_method"));
app.use(flash());



//PASSPORT Config
app.use(require("cookie-session")({//changed from express-session
    secret: process.env.PPSECRET,
    resave: false, 
    saveUninitialized: false
}));
app.locals.moment = require("moment");
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//adding own little middleware
app.use(function(req, res, next){
    res.locals.currentUser  = req.user;
    res.locals.error        = req.flash("error");
    res.locals.success      = req.flash("success");
    next();
})

console.log(process.env.DATABASEURL);
console.log(process.env.PPSECRET);
console.log(process.env.CLAPIKEY);
console.log(process.env.CLAPISECRET);
console.log(process.env.GAPIKEY);

app.use("/", indexRoutes);
app.use("/circles", circleRoutes);
app.use("/circles/:id/reviews", reviewRoutes);
app.use("/users/:id/endorsements", endorsementRoutes);
app.use("/agreements", agreementRoutes);



app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server for radius has started! \n[press ctrl+c to quit]");
});
