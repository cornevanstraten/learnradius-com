var mongoose = require("mongoose");


var reviewSchema = mongoose.Schema({
    title: String,
    text: String,
    createdAt: {type: Date, default: Date.now},
    author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
            },
    recommend: {type: Boolean, default: true}
})


module.exports = mongoose.model("Review", reviewSchema);