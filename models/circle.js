var mongoose = require("mongoose");




//SCHEMA SETUP
var circleSchema = new mongoose.Schema({
    appreciation: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    category: String,
    title: String, //title 
    price: String,
    image: String,
    oneliner: String, //subtitle
    location: String, //transform into {streetAddress, city, GA, ZIP}
        lat: Number,
        lng: Number,
    when: String, 
    description: String,
    swbat: [],
    spots: Number,
    educator: 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
    students:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    agreements:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Agreement"
        }
    ],
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
})






// var OpenClassroom = mongoose.model("OpenClassroom", openclassroomSchema);

module.exports = mongoose.model("Circle", circleSchema);