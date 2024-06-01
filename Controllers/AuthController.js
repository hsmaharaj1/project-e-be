const User = require("../Models/UserModel");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const admin = require("../Models/firebaseAdmin")

module.exports.googleSignIn = async (req, res) => {
    const { token } = req.body;

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        const { email, uid } = decodedToken;

        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ email, googleId: uid });
            await user.save();
        }

        const jwtToken = jwt.sign({ email: user.email, id: user._id }, 'secret', { expiresIn: '1h' });
        const ntoken = createSecretToken(user._id)
        res
            .cookie("token", ntoken, {
                withCredentials: true,
                httpOnly: false
            })
        res.status(200).json({ success: true, message: "Logged In", result: user, token: jwtToken });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Something went wrong' });
    }
}

module.exports.Signup = async (req, res, next) => {
    try {
        const { email, password, createdAt } = req.body;
        const existingUser = await User.findOne({ email });
        // const existingUsername = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const user = await User.create({ email, password, createdAt });
        const token = createSecretToken(user._id);
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        });
        res
            .status(201)
            .json({ message: "User signed in successfully", success: true, user });
        // next();
    } catch (error) {
        console.error(error);
    }
};

module.exports.Login = async (req, res, next) => {
    const { token, password } = req.body;

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        const decodedEmail = decodedToken.email;

        const existingUser = await User.findOne({ email: decodedEmail });
        if (!existingUser) return res.status(404).json({ message: 'User not found' });

        if (!existingUser.password) return res.status(400).json({ success: false, message: "Try Sign in with Google" });

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid credentials' });

        const jwtToken = jwt.sign({ email: existingUser.email, id: existingUser._id }, 'secret', { expiresIn: '1h' });
        const secretToken = createSecretToken(existingUser._id)
        res.cookie("token", secretToken, {withCredentials: true, httpOnly: false})
        res.status(200).json({ success: true, result: existingUser, token: jwtToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}