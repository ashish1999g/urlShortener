const express = require("express");
const router = express.Router();
const auth = require("./auth");
const shortUrl = require("../models/shorturl");


router.get('/', auth, (req,res) => {
    res.render("createUrl", {
    });
})

router.post("/", auth, async (req,res)=>{
    // console.log(req.body)
    const fullUrl = req.body.fullUrl;
    const userId = req.signUser._id;
    const newUrl = await shortUrl.create({
        fullUrl: fullUrl,
        creator: userId
    })
    await newUrl.save();
    res.status(201).send(`
        <h2> URL Generated Successfully </h2>
        <br> <br>
        <h3> Ready For Use </h3>
        <script>
            setTimeout(() => {
                window.location.replace("http://localhost:5000/dashboard");
            }, 3000);
        </script>`);
})

module.exports = router;