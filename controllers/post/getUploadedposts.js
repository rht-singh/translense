const { post } = require("../../models");
const { ROLES } = require("../../models");
exports.getUploadedPost = async (req, res) => {
  try {
    const { User } = req;
    const [user, admin] = ROLES;
    // get role through token then check role valid or not
    if (!ROLES.includes(User.role)) throw new Error("Invalid User");
    let all_posts = [];
    let message = "";
    let total_posts = 0;
    // check role is user send his/her posts
    if (User.role === user) {
      const posts = await post.findAll({
        where: {
          user_id: User.user_id,
        },
      });
      if (!posts.length) {
        message = "No post Found";
      } else {
        message = "Post found";
        total_posts = posts.length;
        all_posts = posts;
      }
    }
    // check role is admin send all posts
    if (User.role === admin) {
      const posts = await post.findAll();
      if (!posts.length) {
        message = "No post Found";
      } else {
        message = "Post found";
        total_posts = posts.length;
        all_posts = posts;
      }
    }

    res.json({ success: true, message, total_posts, all_posts });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
