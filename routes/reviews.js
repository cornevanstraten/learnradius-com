//Reviews
var express         = require("express");
var router          = express.Router({mergeParams: true});
// var OpenClassroom   = require("../models/openclassroom");
var Circle          = require("../models/circle");
var Review          = require("../models/review");
var Agreement       = require("../models/agreement");
var User            = require("../models/user");
var middleware      = require("../middleware/index.js");

//NEW review
router.get("/new", middleware.isLoggedIn, middleware.checkReviewer, function(req, res){
    //find the agreement matching the id in the DB
    Agreement.findById(req.params.id, function(err, agreement){
        if(err){
            console.log(err);
        } else if(agreement.reviewRef) {
                req.flash("error", "You already reviewed this circle")
                res.redirect("back")
            } else {
            res.render("reviews/new", {agreement: agreement})
        }
    })
});
//CREATE new review
router.post("/", middleware.isLoggedIn, middleware.checkReviewer, function(req, res) {
    Agreement.findById(req.params.id, function (err, agreement){
        if(err){
            console.log(err)
            res.redirect("back")
        } else { //check if you're the student
        if(!isStudent(req, agreement)) {
            req.flash("error", "You are not a student of this circle")
            res.redirect("back")
        } else {//check if already reviewed
            if(agreement.reviewRef) {
                req.flash("error", "You already reviewed this circle")
                res.redirect("/")
            } else {//find circle
            Circle.findById(agreement.circleRef, function(err, circle){
            if(err || !circle){
                console.log(err)
                req.flash("error", "This circle does not exist anymore.")
                res.redirect("/")
            } else {//find Educator
            User.findById(agreement.educatorRef, function(err, educator){
                if (err) {
                    console.log(err)
                    req.flash("error", "No educator")
                    res.redirect("back")
                } else {
                    Review.create(req.body.review, function(err, review){
                        if(err) {
                            console.log(err)
                            res.redirect("back")
                        } else {
                            //process educator & circle appreciation +1/-1
                             if(req.body.recommend == "false"){
                                review.recommend = false;
                                educator.appreciation -= 1;
                                circle.appreciation -= 1;
                            } else {
                                educator.appreciation += 1;
                                circle.appreciation += 1;
                            }
                            educator.save() ; console.log(educator)
                            review.author = req.user._id;
                            review.save(); console.log(review)
                            circle.reviews.push(review);
                            circle.save(); console.log(circle)
                            agreement.reviewRef = review._id
                            agreement.save(); console.log(agreement);
                            req.flash("success", "Successfully added your review")
                            res.redirect("/circles/" + circle._id);
                        }
                    })
                }
            })
            }
        })
        }
        }
        }
    })
});



//Check if a visitor is part of a circle
var isStudent = function(req, agreement){ 
    var answer = false
    if(agreement.studentRef.equals(req.user._id)){ answer = true}
    console.log(answer);
    return answer;
}



module.exports = router;