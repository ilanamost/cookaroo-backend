const bcryptJs = require('bcryptjs');
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.createUser = (req, res, next) => {
    bcryptJs.hash(req.body.password, 10).then(hash => {
        const user = new User({
            userName: req.body.userName,
            email: req.body.email,
            password: hash
        });
        user
            .save()
            .then(result => {
                res.status(201).json({
                    message: "User created!",
                    result: result
                });
            })
            .catch(err => {
                res.status(500).json({
                    message: "Invalid authentication credentials!"
                }
                );
            });
    });
}

exports.getUserData = (req, res, next) => {
    User.findById(req.params.id).
        then(fetchedUser => {
            res.status(200).json({
                userName: fetchedUser.userName,
                email: fetchedUser.email
            });
        })
        .catch(err => {
            return res.status(401).json({
                message: "Invalid user id!"
            });
        })
}


exports.userLogin = (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            fetchedUser = user;

            // asynchronously compare the given data against the given hash
            return bcryptJs.compare(req.body.password, user.password);
        })
        .then(result => {
            if (!result) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }

            // synchronously sign the given payload into a JSON Web Token string
            const token = jwt.sign(
                { email: fetchedUser.email, userId: fetchedUser._id },
                process.env.JWT_KEY,
                { expiresIn: "1h" }
            );
            res.status(200).json({
                token: token,
                expiresIn: 3600,
                userId: fetchedUser._id
            });
        })
        .catch(err => {
            return res.status(401).json({
                message: "Invalid authentication credentials!"
            });
        });
}