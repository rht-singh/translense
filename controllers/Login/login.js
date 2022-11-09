const { User } = require("../../models");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../../utils/mail");
const bcrypt = require("bcrypt");
exports.login = async (req, res) => {
  // get email and password in body
  const { email, password } = req.body;
  try {
    // check email and password received or not
    if (!email || !password)
      return res.send({ success: true, msg: "Please sends credentals" });
    // check user with email exist or not
    const exists = await User.findOne({ where: { email: email } });
    if (!exists) return res.send({ success: false, msg: "User Not found" });
    // assign a token to user
    const token = await jwt.sign({ email: email }, "6763gwywstgw", {
      expiresIn: "1800s",
    });
    // check password is correct or not
    let validPassword = await bcrypt.compare(password, exists.password);
    if (!validPassword) throw new Error("Invalid password");
    // send a mail for verification
    await sendMail(email, exists.username, token);
    return res.json({
      success: true,
      msg: "verification link sends successfully",
    });
  } catch (err) {
    res.json({ success: false, err: err.message });
  }
};

exports.Verify = async (req, res) => {
  try {
    const { token } = req.query;
    // check token receive or not
    if (!token) throw new Error("Token not found");
    // check token is valid or not
    const decoded = await jwt.verify(token, "6763gwywstgw");
    if (!decoded.email) throw new Error("Invalid token");
    // check email exist or not
    const user = await User.findOne({ where: { email: decoded.email } });
    if (!user) throw new Error("User not found");
    // set cookie then redirect to homepage
    res.cookie(`translense`, `${token}`);
    res.redirect("/home");
  } catch (error) {
    res.json({ success: true, msg: error.message });
  }
};
