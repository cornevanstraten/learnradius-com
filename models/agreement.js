var mongoose = require("mongoose");


//SCHEMA SETUP
var agreementSchema = new mongoose.Schema({
    //date & time
    createdAt: { type: Date, default: Date.now }, //student joined
    endedAt: { type: Date }, //student unsubscribed OR circle deleted/expired 
    circleDetails: {
            title: String, 
            price: String,
            image: String,
            oneliner: String,
            location: String,
            when: String, 
            description: String,
            swbat: []
    },
    circleRef: 
            {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Circle"
            },    
    //Educator
    educatorDetails: {
            username: String,
            firstName: String,
            lastName: String,
            avatar: String,
            location: String,
            email: String,
            phone: String
    },
    educatorRef: 
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            
    //Student
    studentDetails: {
            username: String,
            firstName: String,
            lastName: String,
            avatar: String,
            email: String,
    },
    studentRef: 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
    
    //Feedback cycle 
    reviewRef: 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        },    
    endorsementRef: 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Endorsement"
        }
        
})



module.exports = mongoose.model("Agreement", agreementSchema);