var express         = require("express");
var router          = express.Router();
// var OpenClassroom   = require("../models/openclassroom");
var Circle          = require("../models/circle");
var Agreement       = require("../models/agreement");
var middleware      = require("../middleware/index.js");
var passport        = require("passport");
var User            = require("../models/user");




//ROOT route
router.get("/", function(req, res){
    Circle.find({}).sort({ $natural: -1 }).limit(4).populate("educator").exec(function(err, foundCircles){
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
    //find the User matching the id in the DB
    User.findById(req.params.id).populate("circles").populate({path: "circles", populate: {path: "reviews"}}).populate({path: "circles", populate: {path: "endorsementRef"}}).exec(function(err, foundUser){
        if(err){
            console.log(err);
            req.flash("error", "This user doesn't exist");
            return res.redirect("back");
        } else {
            //render the show template with that User and pass through found data
            console.log(foundUser)
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
router.put("/users/:id/", middleware.checkUserProfileOwnership, function(req, res){
    var newData = req.body.user
      if(newData.description && newData.avatar && newData.firstName && newData.lastName){
                newData.isEducator = true;
            } else {
                newData.isEducator = false;
            }
    console.log(newData);
    //find and update User
    User.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, updatedUser){
        if(err){
            console.log(err)
            req.flash("error", err.message);
            res.redirect("back")
        } else {
            req.flash("success", "User profile successfully updated")
            res.redirect("/users/" + updatedUser.id)
        }
    })
    //redirect to show page
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
router.post("/users/:id", middleware.isLoggedIn, function(req, res){
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
                    foundUser.save();
                    res.redirect("back");
                    } else {
                    foundUser.fav.push(req.body.circle.id);
                    foundUser.save();
                    res.redirect("back");
                    }
                }
            })
} )

var isFav = function(req){ 
            var answer = false
            if(req.user){
                req.user.fav.forEach(function(circle){
                if(circle == req.body.circle.id){ answer = true }
                })      
            }
    return answer;
}



module.exports = router;