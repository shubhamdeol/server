const { func } = require("joi");
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send("Access Denied");
  }
  try {
    const varified = jwt.verify(token, process.env.TOKEN_SECRET);
    if (varified) {
      req.user = varified;
      next();
    }
  } catch (error) {
    res.status(400).send({ message: "Invalid token" });
  }
};
