
const express = require("express");
const router = express.Router();

const UserController = require("../controllers/user");

router.post("/signup", UserController.createUser);

router.post("/login", UserController.userLogin);

router.get("/:id", UserController.getUserData);

module.exports = router;
