const mongoose = require("mongoose");
const schema = mongoose.Schema ;
const shortId = require("shortid");

const shortUrlSchema = new schema({
    fullUrl: {
        type: String,
        required: true
    },
    shortId: {
        type: String,
        required: true,
        default: shortId.generate
    },
    creator: {
        type: String,
        required: true
    },
    clickCount: {
        type: Number,
        required: true,
        default: 0
    },
    createdTime: {
        type: Date,
        default: Date.now,
        index: { expires: '5min' }
    }
})

module.exports = mongoose.model("shortenUrl", shortUrlSchema)
// expire_at: {
//     type: Date,
//         default: Date.now(),
//         expires: 60
// }
// }, { timestamps: true })