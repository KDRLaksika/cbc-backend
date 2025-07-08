import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function createUser(req, res) {

    if(req.body.role == "admin") {
        if(req.user == null) {
            res.status(403).json({ message: "You are not authorized to create an admin account. Please login first"});
            return;
        }

        if(req.user.role != "admin") {
            res.status(403).json({ message: "You are not authorized to create an admin account." });
            return;
        }
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const user = new User({
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: hashedPassword,
        role: req.body.role,
    });

    user.save().then(() => {
        console.log("User saved to database");
        res.json({ message: "User saved to database" });
    }).catch(() => {
        console.log("Error saving user to database");
        res.json({ message: "Error saving user to database" });
    });
}

export function loginuser(req, res) {

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email }).then((user) => {
        if (user) {
            
            const isPasswordCorrect = bcrypt.compareSync(password, user.password);

            if (isPasswordCorrect) {

                const token = jwt.sign(
                  {
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    img: user.img,
                  },
                  process.env.JWT_KEY,
                );

                console.log("User logged in");
                res.json({ message: "User logged in", 
                          token: token,
                          role: user.role,});


            } else {
                console.log("Invalid password");
                res.json({ message: "Invalid password" });
            }
        } else {
            console.log("User not found");
            res.status(404).json({ message: "User not found" });
        }
    }).catch(() => {
        console.log("Error fetching user from database");
        res.json({ message: "Error fetching user from database" });
    });
}

export function isAdmin(req, res) {
    if(req.user == null) {
        return false;
    }
    if(req.user.role != "admin") {
        return false;
    }
    return true;
}