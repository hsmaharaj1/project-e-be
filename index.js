const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const authRoute = require('./Routes/AuthRoute');
const eventRoute = require('./Routes/EventsRoute')
const cookieParser = require("cookie-parser");
require("dotenv").config();
const { MONGO_URL, PORT } = process.env;

console.log(MONGO_URL, PORT);
mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB is  connected successfully"))
  .catch((err) => console.error(err));

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/", authRoute);
app.use("/events", eventRoute);