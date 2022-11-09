const { User, ROLES } = require("../models");
const jwt = require("jsonwebtoken");
exports.Router = async function (req, res, next) {
  try {
    // Get bearer token and authorization role in headers
    const { auth, authorization } = req.headers;
    if (auth) {
      //extract token
      const token = auth.split(" ")[1];
      if (token) {
        // verify  token isvalid or not
        let { email } = await jwt.verify(token, "6763gwywstgw");
        const user = await User.findOne({ where: { email: email } });
        // check role is exist or not
        if (!ROLES.includes(authorization))
          throw new Error("With this role user not exist");
        if (user.role !== authorization) throw new Error("Unauthorized access");
        if (user) {
          req.User = user;
          next();
        } else res.json({ success: false, error: "Please login again" });
      } else res.json({ success: false, error: "Unauthorized access" });
    } else res.json({ success: false, error: "Unauthorized access" });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
};
