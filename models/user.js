const mongoose = require("mongoose");
const schema = mongoose.Schema;
const jwt = require("jsonwebtoken");


const userSchema = new schema({
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    ipAddress: {
        type: String,
        required: true 
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.methods.generateAuthToken = async function() {
    try {
        const token = jwt.sign({_id:this._id},process.env.SECRET_KEY)
        this.tokens = this.tokens.concat({token: token});
        await this.save();
        return token;
    } catch(err) {
        res.send("Error in generate Token" + err);
    }
}

module.exports = mongoose.model("user",userSchema);