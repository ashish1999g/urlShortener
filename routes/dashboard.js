const express = require("express")
const router = express.Router();
const user =  require("../models/user");
const shortUrl = require("../models/shorturl");
const auth = require("./auth");


router.get('/', auth, async (req,res) => {
    const signUser = req.signUser;
    const shortUrls = await shortUrl.find({creator: signUser._id}).sort({
        'createdTime': -1})
    res.render("dashboard", {
        signUser: signUser,
        shortUrls: shortUrls
    })
})

module.exports = router;