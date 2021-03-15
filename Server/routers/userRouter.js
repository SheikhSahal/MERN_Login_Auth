const { model } = require("mongoose");

const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validate } = require("../models/userModel");

router.post("/", async (req, res) => {
    try {
        const { email, password, passwordVerify } = req.body;

        // validation

        if (!email || !password || !passwordVerify)
            return res
                .status(400)
                .json({ errorMessage: "Please Enter all required feilds." });

        if (password.length < 6)
            return res
                .status(400)
                .json({ errorMessage: "Please Enter a password of atleast 6 characters." });

        if (password !== passwordVerify)
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter the same password twice."
                });

        const existingUser = await User.findOne({ email });

        if (existingUser)
            return res.status(400).json({
                errorMessage: "An account with this email already exists."
            });

        //hash the password
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt); 

        //save the new user account to the db
        const newUser = new User({
            email, passwordHash
        });

        const savedUser = await newUser.save();


        // log the user in
        const token = jwt.sign({
            user: savedUser._id,
        },
        process.env.JWT_SECRET);

        // send the token in a HTTP-only cookie
        res.cookie("token",token,{
            httpOnly: true,
        }).send();

    } catch (err) {
        console.error(err)
        res.status(500).send();
    }


})

router.post("/login", async(req, res) => {
    try{
        const { email, password} = req.body;
        // validate

        if (!email || !password )
        return res
            .status(400)
            .json({ errorMessage: "Please Enter all required feilds." });


        const existingUser = await User.findOne({ email });

        if (!existingUser)
            return res.status(401).json({
                errorMessage: "Wrong email or password."
        });   

        const passwordCorrent = await bcrypt.compare(password, existingUser.passwordHash);

        if(!passwordCorrent)
        return res.status(401).json({
            errorMessage: "Wrong email or password."
    });   

    // log the user in
    const token = jwt.sign({
        user: existingUser._id,
    },
    process.env.JWT_SECRET);

    // send the token in a HTTP-only cookie
    res.cookie("token",token,{
        httpOnly: true,
    }).send();

    }
    catch (err) {
        console.error(err)
        res.status(500).send();
    }
});


router.get("/logout",(req, res) => {
    res.cookie("token","",{
        httpOnly: true,
        expires: new Date(0)
    }).send();
})



module.exports = router;