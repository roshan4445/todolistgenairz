const user = require("../models/userModel")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const dotenv=require("dotenv").config()
module.exports.RegisterController = async (req, res) => {

    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            return res.status(400).json({
                error: "All fields are required"
            })
        }
        const existingUser = await user.findOne({
            email: email
        })
        if (existingUser) {

            return res.status(400).json({
                error: "User already exists"
            })

        }
        const hashedpassword=await bcrypt.hash(password,10)
        const newUser = await user.create({
            name,
            email,
            password:hashedpassword
        })
        res.status(201).json({
            message: "User registered successfully",
            "success":true
        })
    } catch (e) {

        res.status(500).json({
            error: e.message,
            "success":true
        })

    }
}

module.exports.LoginController = async (req, res) => {

    try {

        const { email, password } = req.body
        if (!email || !password) {

            return res.status(400).json({
                error: "All fields are required"
            })

        }
        const credentials = await user.findOne({
            email
        })
        if (!credentials) {

            return res.status(400).json({
                error: "Invalid credentials"
            })

        }
        const passwordCheck = await bcrypt.compare(
            password,
            credentials.password
        )
        if (!passwordCheck) {
            return res.status(401).json({
                error: "Invalid credentials"
            })

        }
        const jwtToken = jwt.sign(

            {
                id: credentials._id
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "7d"
            }

        )
        res.status(200).json({
            success: true,
            message: "Login successful",
            jwtToken: jwtToken,
            userId: credentials._id
        })

    } catch (e) {

        res.status(500).json({
            error: e.message,
            "success":false
        })

    }

}