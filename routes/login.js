const express = require('express');
const router = express.Router();
const user = require("../models/user");
const bcrypt = require("bcryptjs");
// const shortUrl = require("../models/shorturl")
const auth = require("./auth")
const jwt = require("jsonwebtoken");


const loginView = async (req, res, next) => {
    if (req.cookies.jwt) {
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        const signUser = await user.findOne({ _id: verifyUser._id });
        res.send(`
            <h2> ${signUser.name}, You are already logged In </h2>
            <script>
                setTimeout(() => {
                    window.location.replace("http://localhost:5000/dashboard");
                }, 1500);
            </script>`)
    } else {
    res.render("login", {
    });}
}

router.get('/', (req,res)=>{
    res.redirect('/login');
})

router.get('/login', loginView);

router.post('/login', async (req,res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const userData = await user.findOne({email:email});
        // const token = await userData.generateAuthToken();

        if (bcrypt.compare(userData.password,password)) {
            const token = jwt.sign({ _id: userData._id }, 
                process.env.SECRET_KEY);
            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 900000),
                httpOnly: true
            });
            res.status(201).redirect("/dashboard");
        } else {
            res.status(403).send(`
                <h2> InValid Login Details </h2>
                    <br> <br>
                <h3> Please Remember & Try Again </h3>
                <script>
                    setTimeout(() => {
                        window.location.replace("http://localhost:5000/login");
                    }, 3000);
                </script>`);
        }
    } catch(err) {
        res.status(403).send(`error Login ${err}`);
    }
})

router.get("/logout", auth, async (req,res) => {
    try {
        req.signUser.tokens = [];
        res.clearCookie("jwt");
        await req.signUser.save();
        res.send(`
            <h2> ${req.signUser.name} Logged Out Successfully </h2>
                <br> <br>
            <h3> Redirecting to LoGin Page </h3>
            <script>
                setTimeout(() => {
                    window.location.replace("http://localhost:5000/login");
                }, 3000);
            </script>`);
    } catch(err) {
        res.send(`${err} in LogOut`);
    }
})


module.exports = router;