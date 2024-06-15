const router = require("express").Router()
const {createUser, updateUser, isUpdated} = require("../Controllers/UserController")
const verifyToken = require("../Middlewares/VerifyToken")

router.post("/create", verifyToken, createUser)
router.put("/update", verifyToken, updateUser)
router.get("/isupdated", verifyToken, isUpdated)

module.exports = router