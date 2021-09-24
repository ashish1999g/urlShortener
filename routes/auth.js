const jwt = require("jsonwebtoken");
const user = require("../models/user");


const auth = async (req,res,next) => {
    try {
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token,process.env.SECRET_KEY);
        // console.log(`Auth User is ${verifyUser}`);
        const signUser = await user.findOne({_id: verifyUser._id});
        req.token = token;
        req.signUser = signUser;
        next();
    } catch (error) {
        res.status(401).send(`
            <h2> error in Auth </h2>${error} <br>
            <h1> LoGin Again </h1>
            <script>
                setTimeout(() => {
                    window.location.replace("http://localhost:5000/login");
                }, 3000);
            </script>`);
    }
}

module.exports = auth ;