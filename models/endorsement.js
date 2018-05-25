var mongoose = require("mongoose");


var endorsementSchema = mongoose.Schema({
    author: { //educator
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
    },
    circle: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Circle"
    },
    text: String,
    createdAt: {type: Date, default: Date.now}
})


module.exports = mongoose.model("Endorsement", endorsementSchema);