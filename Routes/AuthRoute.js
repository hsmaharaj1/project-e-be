const { Signup, Login, googleSignIn } = require("../Controllers/AuthController");
const { userVerification } = require("../Middlewares/AuthMiddlewares");
const router = require("express").Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/google-signin", googleSignIn)
router.post('/', userVerification);

module.exports = router;