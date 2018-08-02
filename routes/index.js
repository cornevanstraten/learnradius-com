var express         = require("express");
var router          = express.Router();
// var OpenClassroom   = require("../models/openclassroom");
var Circle          = require("../models/circle");
var Agreement       = require("../models/agreement");
var middleware      = require("../middleware/index.js");
var passport        = require("passport");
var User            = require("../models/user");


//multer
var multer          = require('multer');
var storage         = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});

var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

//cloudinary
var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'openclassroom', 
  api_key: process.env.CLAPIKEY,
  api_secret: process.env.CLAPISECRET
});



//ROOT route
router.get("/", function(req, res){
    Circle.find({}).sort({ $natural: -1 }).limit(3).populate("educator").exec(function(err, foundCircles){
        if (err) {
                console.log(err)
                res.redirect("back")
            } else { //no error
                res.render("landing", {circles: foundCircles});
            }
    });
});




//-----------
//USER ROUTES
//-----------


//REGISTER
//show register form
router.get("/register", function(req, res){
   res.render("register"); 
});
//handle register/signup logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message)
            console.log(err)
            return res.redirect("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to radius, " + user.username)
            res.redirect("/users/" + user.id + "/edit"); 
        });
    });
});



//LOGIN
//show login form
router.get("/login", function(req, res){
    res.render("login");
});

//handling login logic
router.post("/login", passport.authenticate("local", 
    {
    successRedirect: "/",
    failureRedirect: "/login"
    }), function(req, res){
    
});

//logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out")
    res.redirect("/");
})


//USER PROFILE PAGE SHOW ROUTE
router.get("/users/:id", function(req, res){
    User.findById(req.params.id).populate("circles").populate({path: "circles", populate: {path: "reviews"}}).populate({path: "joinedCircles", populate: {path: "endorsementRef"}}).exec(function(err, foundUser){
        if(err){
            console.log(err);
            req.flash("error", "This user doesn't exist");
            return res.redirect("back");
        } else {
            res.render("users/show", {user: foundUser});
        }
    })
})

//EDIT FORM
router.get("/users/:id/edit", middleware.checkUserProfileOwnership, function(req, res){
        User.findById(req.params.id, function(err, foundUser){
                res.render("users/edit", {user: foundUser});
            })
})
//UPDATE
router.put("/users/:id/", middleware.checkUserProfileOwnership, upload.single('avatar_upload'), function(req, res){
    var newData = req.body.user
    // if(req.file){console.log(req.file)}
      if(newData.description 
        //   && newData.avatar 
          && newData.firstName 
          && newData.lastName){

                newData.isEducator = true;
            } else {
                newData.isEducator = false;
            }
            if (req.file){
                    cloudinary.uploader.destroy(req.body.oldAvatar, function(error, result){console.log("deleted:" + result)});
                    cloudinary.uploader.upload(req.file.path, function(result) {
                    newData.avatar = imageName(result.secure_url); 
                    updateUser(newData, req, res);
                    });
                } else {
                    updateUser(newData, req, res)
                }
})


//USER DASHBOARD
router.get("/users/:id/dashboard", middleware.isLoggedIn, function(req, res){
    //check ownership
    if(req.params.id == req.user._id){
        //find the User matching the id in the DB
        User.findById(req.user._id).populate("circles").populate({path: "circles", populate: {path: "agreements"}}).populate("joinedCircles").populate("fav").exec(function(err, foundUser){
            if(err){
                console.log(err)
                req.flash("error", "This user doesn't exist");
                return res.redirect("back");
            } else {
                //render the dashboard with that User and pass through found data
                console.log(foundUser);
                res.render("users/dashboard", {user: foundUser});
            }
        })
    } else {
        req.flash("error", "You don't have permission to access this page.");
        return res.redirect("back");
    }
});


//-----------
//OTHER ROUTES
//-----------

router.get("/about", function(req, res){
   res.render("about"); 
});

router.get("/blog", function(req, res){
   res.render("blog"); 
});

//favorite
router.put("/users/:id/fav", middleware.isLoggedIn, function(req, res){
    User.findById(req.params.id, function(err, foundUser){
                if(err){
                    res.redirect("back");
                } else { //check if already favorited 
                    var thisFav = isFav(req);
                    if(thisFav){ 
                        for(var i=0; i< foundUser.fav.length; i++){
                                if(foundUser.fav[i] == req.body.circle.id){
                                    foundUser.fav.splice(i, 1);
                                }
                            }
                    } else {
                    foundUser.fav.push(req.body.circle.id);
                    }
                    User.findByIdAndUpdate(req.params.id, {$set: foundUser}, function(err, foundUser){
                        if(err){
                            console.log(err);
                        }
                    // foundUser.save();
                    res.redirect("back");
                    })
                }
            })
} )

var isFav = function(req){ //checks if circle is already favorited 
            var answer = false
            if(req.user){
                req.user.fav.forEach(function(circle){
                if(circle == req.body.circle.id){ answer = true }
                })      
            }
    return answer;
}

var updateUser = function(newData, req, res){
        User.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, updatedUser){
        if(err){
            console.log(err)
            req.flash("error", err.message);
            res.redirect("back")
        } else {
            req.flash("success", "User profile successfully updated")
            res.redirect("/users/" + updatedUser.id +"/dashboard")
        }
    })
}


var imageName = function(url){
    var slashindex = url.lastIndexOf('/')+1
    var dotindex = url.lastIndexOf('.') 
    var file = url.slice(slashindex, dotindex)
    return file
}


module.exports = router;