const express = require('express');
const router = express.Router();
const user = require("../models/user");
const bcrypt = require("bcryptjs");
const salt = 10;
var requestIp = require('request-ip');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/urlShortener', {
    useNewUrlParser: true, 
    useUnifiedTopology: true
})

const registerView = (req, res) => {
    res.render("register", {
    });
}

router.get('/', registerView);

router.post('/',async (req,res) =>{
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const emailCount = await user.findOne({email: email}).count();
    if (emailCount) {
        res.status(403).send(`
            <h2> Email Already Exist </h2>
            <h3> Please Register Again </h3>
            <script>
                setTimeout(() => {
                    window.location.replace("http://localhost:5000/register");
                }, 3000);
            </script>`);
    }
    else {
        const encrypt_password = await bcrypt.hash(password,salt);
        var clientIp = requestIp.getClientIp(req);
        const newUser = await user.create({ 
            name: name,
            email: email,
            password: encrypt_password,
            ipAddress: clientIp
        })
        const token = await newUser.generateAuthToken();
        const newRegisteredUser = await newUser.save();
        res.status(201).send(`
            <h2> Registration Done Successfully </h2>
            <br> <br>
            <h3> ${newRegisteredUser.name}, Now You Can Login </h3>
            <script>
                setTimeout(() => {
                    window.location.replace("http://localhost:5000/login");
                }, 3000);
            </script>`);
    }
});

module.exports = router;