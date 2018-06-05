//Circles routes
var express         = require("express");
var router          = express.Router();
// var OpenClassroom   = require("../models/openclassroom");
var Circle          = require("../models/circle");
var Agreement       = require("../models/agreement");
var middleware      = require("../middleware/index.js");

//google maps 
var googleMapsClient = require('@google/maps').createClient({
  key: process.env.GAPIKEY
});

// var geocoder        = require('geocoder');
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




//DESTROY

//INDEX
router.get("/", function(req, res){
    addZip(req);
    if(req.query.search){
        var kwerrie = toOneWord(req.query.search)
        const regex = new RegExp(escapeRegex(kwerrie), "gi");
        Circle.find({
            $or: [
                {title: regex},
                {description: regex},
                {oneliner: regex}
                ]}).populate("educator").exec(function(err, foundCircles){
            if (err) {
                console.log(err)
                res.redirect("back")
            } else { //no error
                if(foundCircles.length < 1){
                                findEducator(regex, req, res);
                            } else { //we did find results matching querie
                            res.render("circles/index", {circles: foundCircles});
                            }
                        }
                    });
    } else {//blank search or no search 
        Circle.find({}).populate("educator").exec(function(err, allCircles){
            if(err){
                console.log(err);
            } else {
                 res.render("circles/index", {circles: allCircles});
            }
        })
    }
});


//NEW form
router.get("/new", middleware.isLoggedIn, middleware.checkEducator, function(req, res){
    res.render("circles/new")
})

//POST NEW circle
router.post("/", middleware.isLoggedIn, middleware.checkEducator, upload.single('image_upload'), function(req, res){
     var    newData = req.body.circle; //get data from form and add to the array
            newData.educator = req.user._id;
            newData.swbat = [];
            newData.swbat.push(req.body.swbat1, req.body.swbat2, req.body.swbat3);
    //maps
    googleMapsClient.geocode({
          address: req.body.circle.location
        }, function(err, response) {
          if (!err && response.json.results.length > 0) {
                newData.lat = response.json.results[0].geometry.location.lat;
                newData.lng = response.json.results[0].geometry.location.lng;
                newData.location = response.json.results[0].formatted_address;
              }
            if(req.file){
            cloudinary.uploader.upload(req.file.path, function(result) {
                newData.image = imageName(result.secure_url); // add cloudinary url for the image to the campground object under image property
                //Circle.create
                createListing(newData, req, res);
            });
                } else {
                //Circle.create
                createListing(newData, req, res);
            } 
            });
});



//SHOW
router.get("/:id", function(req, res){
    //find the OC matching the id in the DB
    Circle.findById(req.params.id).populate("educator").populate({path: "reviews", populate: {path: "author"}}).populate("students").exec(function(err, foundCircle){
        if(err){
            console.log(err || foundCircle == null);
            req.flash("error", "Circle not found");
            res.redirect("back")
        } else {
                var reviewedB4 = false
                foundCircle.reviews.forEach(function(review){
                    if(req.user){
                    if(review.author.id == req.user.id){ reviewedB4 = true }
                    }
                })  
            //find the educator's other circles
            User.findById(foundCircle.educator).populate("circles").exec(function(err, foundUser){
                if(err){
                    console.log(err);
                    req.flash("error", "Circle not found");
                    res.redirect("back")
                } else {
                    // console.log(foundCircle);
                    var visitorIsStudent = isStudent(req, foundCircle);
                    var thisFav = isFav(req);
                    res.render("circles/show", 
                        { 
                            circle: foundCircle, 
                            educator: foundUser, 
                            visitorIsStudent: visitorIsStudent,  
                            isFav: thisFav, 
                            reviewedB4: reviewedB4 
                        })
                }
            })
        }
    })
})

//EDIT FORM
router.get("/:id/edit", middleware.checkCircleOwnership, function(req, res){
        Circle.findById(req.params.id, function(err, foundCircle){
                res.render("circles/edit", {circle: foundCircle});
            })
})
//UPDATE
router.put("/:id", middleware.checkCircleOwnership, upload.single('image_upload'), function(req, res){
    var newData = req.body.circle
        newData.swbat = [];
        newData.swbat.push(req.body.swbat1, req.body.swbat2, req.body.swbat3);
    //maps
        googleMapsClient.geocode({address: req.body.circle.location}, function(err, response) {
          if (!err && response.json.results.length > 0) {
                newData.lat = response.json.results[0].geometry.location.lat;
                newData.lng = response.json.results[0].geometry.location.lng;
                newData.location = response.json.results[0].formatted_address;
              }
            //picture stuff
            if(newData.image !== req.body.oldImage){ //if new picture; do picture stuff
                if (req.body.oldImage.indexOf("cloudinary.com/openclassroom/") >= 0){ //if old one was cloudinary, delete
                    cloudinary.uploader.destroy( imageName(req.body.oldImage), function(error, result){console.log("deleted:" + result)});
                }
                if (req.file){
                    cloudinary.uploader.upload(req.file.path, function(result) {
                        newData.image = imageName(result.secure_url); // add cloudinary url for the image to the campground object under image property
                        updateListing(newData, req, res);
                    });
                } else {
                    updateListing(newData, req, res);
                }
            }   else {
                    updateListing(newData, req, res);
            }
            });
})



//DESTROY
router.delete("/:id/", middleware.checkCircleOwnership, function(req, res){
    Circle.findById(req.params.id, function(err, circle){
        if(err){
            req.flash("error", "We did not find your circle");
            res.redirect("back");
        } else {
            if (circle.students.length < 1) {//check if still active agreements 
            var url = circle.image
            if (url.indexOf("cloudinary.com/openclassroom/") >= 0){ //if one of our cloudinary images, delete it from Cloudinary
                cloudinary.uploader.destroy(imageName(url), function(error, result){console.log("deleted:" + result)});
            }; 
                Circle.findByIdAndRemove(req.params.id, function(err){
                    if (err){
                        req.flash("error", "Circle does not exist");
                        res.redirect("back");
                    } else {
                        console.log("Circle deleted")
                        req.flash("success", "Circle successfully deleted")
                        res.redirect("/circles")
                    }
                })
            } else {
                req.flash("error", "There are still students in your circle!")
                res.redirect("back");
            }   
        }
    })
})




//SEPERATE FUNCTIONS

function escapeRegex(text){
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

function toOneWord(zoekterm){
    return zoekterm.slice(0, zoekterm.indexOf(' '))
}

//Check if a visitor is (already) part of a circle
var isStudent = function(req, circle){ 
    var answer = false
    
    if (req.user){
        circle.students.forEach(function(student){
            console.log(student)
            if(student.equals( req.user._id)){ answer = true}
        })
    }
    console.log(answer);
    return answer;
}


//Check if a visitor has already favorited a circle
var isFav = function(req){ 
            var answer = false
            if(req.user){
                req.user.fav.forEach(function(circle){
                if(circle == req.params.id){ answer = true }
                })      
            }
    return answer;
}

var imageName = function(url){
    var slashindex = url.lastIndexOf('/')+1
    var dotindex = url.lastIndexOf('.') 
    var file = url.slice(slashindex, dotindex)
    return file
}

var createListing = function(newData, req, res){
    Circle.create(newData, function(err, circle){ //create new circle and save to DB
            if (err){
                console.log(err);
                req.flash("error", err.message)
                res.redirect("/")
            } else {
                User.findById(newData.educator, function(err, educator){
                    if(err){
                        console.log(err)
                        req.flash("error", err.message)
                        res.redirect("/")
                    } else {
                        educator.circles.push(circle); //push listing to user array  
                        educator.save();
                        req.flash("success", "Circle successfully created")
                        res.redirect("/circles");
                    }
                })
                }
        });//closes circle.create
}

var updateListing = function(newData, req, res){
        Circle.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, updatedCircle){ //find and update
        if(err){
            console.log(err)
            req.flash("error", err.message);
            res.redirect("back")
        } else {
            req.flash("success", "Circle successfully updated")
            res.redirect("/circles/" + updatedCircle.id)
        }
    })
}


var addZip = function(req){
    if(req.user && req.query.ZIP) {
        User.findById(req.user.id, function(err, user){
            if (err) {
                return
            } else {
                user.zip = req.query.ZIP;
                user.save();
            }
        })
    }
}

var findEducator = function(regex, req, res){
        User.find({
        $or: [
                {firstName: regex},
                {lastName: regex}
            ]}).populate("circles").exec(function(err, educators){
                if(err) {
                    console.log(err)
                    res.redirect("back")
                } else {
                    if (educators.length < 1){
                        req.flash("error", "We didn't find any circles matching your search");
                        return res.redirect("back");
                    } else {
                    console.log("/users/" + educators[0]._id)
                    res.redirect("/users/" + educators[0]._id)
                    }
                }
            })
}




module.exports = router;