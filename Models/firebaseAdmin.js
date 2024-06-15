const admin = require("firebase-admin");
const serviceAccount = require("../projecte-adminsdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
