const { User } = require("../../models");
const { sendMail } = require("../../utils/mail");
const bcrypt = require("bcrypt");
const { ROLES } = require("../../models");
const jwt = require("jsonwebtoken");
const schema = require("../../utils/validateUser");

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    // check credentials provided in body required credentials or not
    const { error, value } = await schema.validateAsync({
      username,
      password,
      email,
      role,
    });
    if (error) throw new Error(error);
    // check user with username already exist or not
    let user = await User.findOne({
      where: {
        username: username,
      },
    });
    if (user) {
      return res.status(400).send({
        success: fale,
        msg: "Failed! Username is already in use!",
      });
    }
    // check user exist or not with email
    const exists = await User.findOne({ where: { email: email } });

    if (exists) {
      return res.send({ success: false, msg: "User already exist" });
    }
    // check role defined by user available or not
    if (!ROLES.includes(role)) {
      res.status(400).send({
        success: false,
        msg: "Failed! Role does not exist = " + role,
      });
    }
    // encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);
    // assign a token
    const token = await jwt.sign({ email: email }, "6763gwywstgw", {
      expiresIn: "1800s",
    });
    // create a user
    const create_user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });
    // send mail for verification
    await sendMail(email, username, token);
    if (!create_user) throw new Error("Couldn't create user");
    return res.json({
      success: true,
      msg: "verification link sends successfully",
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false, msg: err.message });
  }
};
