const router = require("express").Router()
const {createUser, updateUser} = require("../Controllers/UserController")
const verifyToken = require("../Middlewares/VerifyToken")

router.post("/create", verifyToken, createUser)
router.put("/update", verifyToken, updateUser)

module.exports = router