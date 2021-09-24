require('dotenv').config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const cookieParser = require("cookie-parser");
const shortUrl = require("./models/shorturl")

const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/urlShortener', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const clickLimit = 10;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", require("./routes/login"));
app.use("/register", require("./routes/register"));
app.use("/dashboard", require("./routes/dashboard"));
app.use("/createUrl", require("./routes/createUrl"));

app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    // console.log(shortId);
    const urlData = await shortUrl.findOne({ shortId: shortId });
    if (!urlData) {
        res.status(404).send(`
            <h2> Shortened URL not found </h2>
            <br>
            <h3> Shorten New Url Here </h3>
            <script>
                setTimeout(() => {
                    window.location.replace("http://localhost:5000/login");
                }, 1500);
            </script>`);
    } else {
        if (urlData.clickCount <= clickLimit) {
            urlData.clickCount += 1;
            await urlData.save();
            const fullUrl = urlData.fullUrl;
            if (urlData.clickCount === clickLimit) {
                await shortUrl.deleteOne({ _id: urlData._id });
            }
            res.redirect(fullUrl);
        }
    }
})


app.listen(PORT, () => {
    console.log("App Listening at " + PORT);
})