var express         = require("express");
var router          = express.Router();
// var OpenClassroom   = require("../models/openclassroom");
var Circle          = require("../models/circle");
var Agreement       = require("../models/agreement");
var middleware      = require("../middleware/index.js");
var User            = require("../models/user");



//NEW AGREEMENT (joining circle)
router.post("/new", middleware.isLoggedIn, function(req, res){
    Circle.findById(req.body.circle.id).populate("educator").exec(function(err, circle){ //look up circle in question 
        if(err){
            req.flash("error", err.message)
            res.redirect("back");
        } else if(circle.spots < 1) {
            req.flash("error", "There are currently no more spots available. Please check back later.")
            res.redirect("/circles/" + circle.id);
            } else {
            User.findById(req.user._id, function(err, student){ //retrieve user/student information
                if(err){
                    console.log(err)
                    req.flash("error", err.message)
                    res.redirect("/circles");
                } else {
                    if(isStudent(req, circle)){
                        req.flash("error", "You already joined this circle!")
                        res.redirect("/circles/" + circle._id);
                    } else {
                        User.findById(circle.educator._id, function(err, educator){ //retrieve educator information
                        if(err){
                            console.log(err)
                            req.flash("error", err.message)
                            res.redirect("/circles");
                        } else {
                        //build new agreement 
                        var newAgreement ={}
                            newAgreement.circleRef = req.body.circle.id;
                            newAgreement.educatorRef = circle.educator._id;
                            newAgreement.studentRef = req.user._id;
                        //consider making this a separate function ()
                        var classDetails = 
                            {
                                title:          circle.title,
                                price:          circle.price,
                                image:          circle.image,
                                oneliner:       circle.oneliner,
                                location:       circle.location,
                                when:           circle.when, 
                                description:    circle.description,
                                swbat:          circle.swbat
                            }
                        //consider making this a separate function ()
                        var educatorDetails = 
                            {
                                username:   educator.username,
                                firstName:  educator.firstName,
                                lastName:   educator.lastName,
                                avatar:     educator.avatar,
                                location:   educator.location,
                                email:      educator.email,
                                // phone: 
                            }
                        //consider making this a separate function (student)
                        var studentDetails = 
                            {
                                username:   student.username,
                                firstName:  student.firstName,
                                lastName:   student.lastName,
                                avatar:     student.avatar,
                                email:      student.email
                            }
                        newAgreement.circleDetails = classDetails;
                        newAgreement.educatorDetails = educatorDetails
                        newAgreement.studentDetails = studentDetails;
                        Agreement.create(newAgreement, function(err, agreement){
                            if(err){
                                console.log(err)
                                res.redirect("back")
                            } else {
                                console.log("New agreement: " + agreement);
                                circle.students.push(student);
                                circle.agreements.push(agreement);
                                circle.spots -= 1;
                                circle.save();
                                student.joinedCircles.push(agreement)
                                student.save();
                                educator.soldCircles.push(agreement)
                                req.flash("success", "You successfully joined this circle!")
                                res.redirect("/circles/" + circle._id);
                            }
                        }) 
                        }
                    })
                }
            }
        })
    }
})
})


//LEAVE AGREEMENT
router.put("/:id/leave", middleware.isLoggedIn, middleware.isEducatorOrStudent, function(req, res){
        Agreement.findById(req.params.id, function(err, agreement){
            if(err){
                console.log(err)
                req.flash("error", err.message);
                res.redirect("back")
            } else {
                if(agreement.endedAt){
                    req.flash("error", "Enrollment already terminated");
                    res.redirect("back");
                } else {
                Circle.findById(agreement.circleRef, function(err, circle){
                    if (err){
                        console.log(err)
                        req.flash("error", "Circle does not exist anymore.")
                        res.redirect("back");
                    } else {
                        for(var i=0; i< circle.students.length; i++){
                            console.log(circle.students[i])
                            console.log(agreement.studentRef)
                                // if(circle.students[i] == req.user.id){
                                if(agreement.studentRef.equals(circle.students[i])){
                                    circle.students.splice(i, 1);
                                }
                            }
                        circle.save();
                        agreement.endedAt = Date.now();
                        agreement.save();
                        req.flash("success", "Circle enrollment terminated");
                        res.redirect("back");
                    }
                })
            }
            }
    })
})

//SEPERATE FUNCTIONS

//Check if a visitor is (already) part of a circle
var isStudent = function(req, circle){ 
    var answer = false
    console.log(req.user._id)
    circle.students.forEach(function(student){
        console.log(student)
        if(student.equals(req.user._id)){ answer = true}
    })
    console.log(answer);
    return answer;
}


module.exports = router;