var mongoose   = require("mongoose");
var passportLocalMongoose   = require("passport-local-mongoose");


var UserSchema = mongoose.Schema({
    username:   String, 
    password:   String,
    joinedAt: { type: Date, default: Date.now }, //registered account at
    fav: [ //favorite circles 
        {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Circle"
        }
        ],
    joinedCircles: [//agreements entered into as a student (orange), past and present
            {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Agreement"
            }
        ],
    //Educator    
    avatar:     {type: String, default: "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"}, //image URL; 
    coverImage: {type: String, default: "https://wallpaper-house.com/data/out/9/wallpaper2you_302390.jpg"}, 
    firstName:  String,
    lastName:   String, 
    email:      String,
    posRev:     Number,
    location:   String, //city
    zip:        String,
    worldview:  String,
    method:     String,
    description: String, //describe yourself and your experience/credentials; why are you a good educator?
    isEducator: {type: Boolean, default: false},
    circles: [ //hosted by this user
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Circle"
        }
    ],
    soldCircles: [//agreements entered into as an educator (blue) 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Agreement"
        }],

    //Reviews & Endorsements
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    appreciation: { type: Number, default: 0 },
    endorsements: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Endorsement"
        }
    ]
})

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);