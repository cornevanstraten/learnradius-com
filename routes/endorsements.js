//Endorsements
var express         = require("express");
var router          = express.Router({mergeParams: true});
// var OpenClassroom   = require("../models/openclassroom");
var Circle          = require("../models/circle");
var Review          = require("../models/review");
var Agreement       = require("../models/agreement");
var Endorsement     = require("../models/endorsement");
var User            = require("../models/user");
var middleware      = require("../middleware/index.js");


//NEW endorsement
router.get("/new", middleware.isLoggedIn, function(req, res){
    //find the agreement matching the id in the DB
    Agreement.findById(req.params.id, function(err, agreement){
        if(err){
            console.log(err);
        } else if(agreement.endorsementRef) {
                req.flash("error", "You already reviewed this circle")
                res.redirect("back")
            } else {
            //render show template with that OC
            res.render("endorsements/new", {agreement: agreement})
        }
    })
});
//CREATE new endorsement
router.post("/", middleware.isLoggedIn, function(req, res){
    var student = req.body.student;
    var newEndorsement = req.body.endorsement;
        newEndorsement.circle = req.body.circle.id;
        newEndorsement.author = req.user._id;

    Endorsement.create(req.body.endorsement, function(err, endorsement){
        if(err){
            console.log(err);
            req.flash("error", err)
            res.redirect("back");
        } else {
            console.log(endorsement);
            Agreement.findById(req.body.agreement.id, function(err, agreement){
                if(err){
                    console.log(err);
                    req.flash("error", err)
                    res.redirect("back");
                } else {
                    //toevoegen aan user endorsement array
                    agreement.endorsementRef = endorsement;
                    agreement.save();
                    console.log(agreement)
                    //render user show page 
                    req.flash("success", "You successfully endorsed " + student.firstName + " " + student.lastName);
                    res.redirect("/users/" + student.id);
                }
            })
        }
    })
})


module.exports = router;