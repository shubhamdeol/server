const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../modals/User");
const { loginValidation } = require("../validation");

router.post("/login", async (req, res) => {
  // validating the data before user creation
  const { error, value } = loginValidation(req.body);
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }

  // checking if user already exist

  const alreadyUser = await User.findOne({ phone: value.phone });

  if (alreadyUser) {
    // password check
    const validPass = await bcrypt.compare(
      value.password,
      alreadyUser.password
    );
    if (!validPass) {
      return res.status(400).send({ message: "Password is wrong" });
    }
    const token = jwt.sign({ _id: alreadyUser._id }, process.env.TOKEN_SECRET);
    return res.header("auth-token", token).send({ token });
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(value.password, salt);
  // create new user
  const user = new User({
    phone: value.phone,
    password: hashedPassword,
  });
  try {
    const savedUser = await user.save();
    if (savedUser) {
      const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
      res.header("auth-token", token).send({ token });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
