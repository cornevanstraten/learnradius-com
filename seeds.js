var mongoose        = require("mongoose"),
    OpenClassroom   = require("./models/openclassroom"),
    Review          = require("./models/review");


//some sample seed data
var data = [
        {   
            name: 'Nightingale singing lessons',
            image: 'https://images.unsplash.com/photo-1453738773917-9c3eff1db985?auto=format&fit=crop&w=1050&q=80',
            description: 'Take this course, and soon you will sing like a bird'
        },
        {
            name: "Computer Science", 
            image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=1567&q=80",
            description: "You are the next Mark Zuckerberg"
        },
        {
            name: "Phantastic Photography",
            image: "https://images.unsplash.com/photo-1483034695875-9b894c34cecd?auto=format&fit=crop&w=1016&q=80",
            description: "Make better use of light and composition and improve your pictures by 10x"
        }
    ]

    
function seedDB(){
    removeReviews();
    //remove all OpenClassrooms 
    OpenClassroom.remove({}, function(err){
        if(err){
            console.log(err);
        } else {
                console.log("removed all openclassrooms");
                data.forEach(function(seed){
                    OpenClassroom.create(seed, function(err, openclassroom){
                        if (err){
                            console.log(err)
                        } else {
                            console.log("new OpenClassroom created");
                            //create an endorsement
                            Review.create(
                                {
                                    text: "Great OpenClassroom, I learned a ton!",
                                    author: "Albert Einstein"
                                }, function(err, review){
                                    if(err){
                                        console.log(err)
                                    } else {
                                        openclassroom.reviews.push(review);
                                        openclassroom.save();
                                        console.log("review created");
                                    }
                                });
                        }
                    })
                })
        }
    });
}

function removeReviews(){
    Review.remove({}, function(err){
        if(err){
            console.log(err);
        }else {
            console.log("Reviews removed as well")
        }
    })
}










module.exports = seedDB;