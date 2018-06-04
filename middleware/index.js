//MIDDLEWARE
var middlewareObj   = {}

var Circle          = require("../models/circle");
var Review          = require("../models/review");
var User            = require("../models/user");
var Agreement       = require("../models/agreement");



middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    //!IMPORTANT: always put flash before the redirect
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

middlewareObj.checkCircleOwnership = function(req, res, next){
    //check logged in
    if(req.isAuthenticated()){
        //check ownership by retrieving the listing
        Circle.findById(req.params.id).populate("educator").exec(function(err, foundCircle){
        if(err){
            console.log(err)
            req.flash("error", "404 Circle not found");
            res.redirect("/circles");
        } else {
            //does user own circle?
                //cannot do == here because one is a mongoose object and one is a string
            if(foundCircle.educator._id.equals(req.user.id)){
                next();
            } else {
                req.flash("error", "You don't have permission to do that")
                res.redirect("back");
            }
        }
    })
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/login");
    }
}


middlewareObj.checkEducator = function(req, res, next){
    return next();
    // if(req.user.isEducator){
    //     return next();
    // }
    // req.flash("error", "Please complete your user profile before creating an OpenClassroom");
    // res.redirect("/users/" + req.user.id);
}

middlewareObj.isEducatorOrStudent = function(req, res, next){
    Agreement.findById(req.params.id, function(err, agreement){
            if(err){
                console.log(err)
                req.flash("error", err.message);
                res.redirect("back")
            } else {
                if(agreement.studentRef.equals(req.user._id) || agreement.educatorRef.equals(req.user._id)){
                        return next();
                        }
                        req.flash("error", "You don't have permission to do that")
                        res.redirect("back");
                }
        })
}

//Check if a user is allowed to review an OpenClassroom 
middlewareObj.checkReviewer = function(req, res, next){
    if(req.user.firstName && req.user.avatar){
        return next();
    }
    //!IMPORTANT: always put flash before the redirect
    req.flash("error", "Please complete your user profile before creating a review");
    res.redirect("/users/" + req.user.id);
}

//Check if a user is allowed to edit this user profile
middlewareObj.checkUserProfileOwnership = function(req, res, next){
    //check logged in
    if(req.isAuthenticated()){
            //check ownership by retrieving the user
           User.findById(req.params.id, function(err, foundUser){
        if(err){
            console.log(err)
            req.flash("error", "User not found");
            res.redirect("back");
        } else {
            //does user own user profile
            if(foundUser.id == req.user.id){
                next();
            } else {
                req.flash("error", "You don't have permission to do that")
                res.redirect("back");
            }
        }
    })
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/login");
    }
}

//Check if a visitor is part of a circle
// !! ALWAYS AFTER isLoggedIn middleware
middlewareObj.isStudent = function(req, res, next){
            var isStudent = false;
            req.user.joinedCircles.forEach(function(agreement){
                if(agreement == req.params.id){ 
                    isStudent = true;
                }
            })       
            if(isStudent) {
                return next();
            } else {
                        req.flash("error", "You are not part of this learning circle");
                        res.redirect("back"); 
                    }
         
}

//Check if student is part of an AGREEMENT
// !! ALWAYS AFTER isLoggedIn middleware
middlewareObj.isStudent2 = function(req, res, next){
            var isStudent2 = false;
            req.user.joinedCircles.forEach(function(agreement){
                if(agreement == req.params.id){ 
                    isStudent = true;
                }
            })       
            if(isStudent) {
                return next();
            } else {
                        req.flash("error", "You are not part of this learning circle");
                        res.redirect("back"); 
                    }
         
}



var isStudent = function(req, openclassroom){ 
    var answer = false
    console.log(req.user._id)
    openclassroom.students.forEach(function(student){
        console.log(student)
        if(student.equals(req.user._id)){ answer = true}
    })
    console.log(answer);
    return answer;
}

var isStudent2 = function(req, agreement){
    var answer = false
    if(agreement.studentRef.equals(req.user._id)){ answer = true}
    console.log(answer);
    return answer;
}






module.exports = middlewareObj