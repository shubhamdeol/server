const express = require("express");
const dotEnv = require("dotenv");
const mongoose = require("mongoose");
const app = express();
// user to set custom variables to  process.env
dotEnv.config();

// import routes
const authRoute = require("./routes/auth");

mongoose.connect(process.env.DB_CONNECT, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("horreey, successfully connected to server");
});

// middlewares
app.use(express.json());
app.use("/api/user", authRoute);

const port = 3000;

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
