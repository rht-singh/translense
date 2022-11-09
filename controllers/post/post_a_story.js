const { uploadFile } = require("../../utils/uploadDrive");
const fs = require("fs");
const path = require("path");
const { post } = require("../../models");
exports.Post_a_Story = async (req, res) => {
  try {
    // get file , title and description in form data
    const { file } = req;
    const { title, description } = req.body;
    // check title and description send by user or not
    if (!title || !description) throw new Error("No title or description");
    // check file received or not
    if (!file)
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });

    const { User } = req;

    const filepath = path.join(
      path.dirname(process.mainModule.filename),
      `/uploads/${file.originalname}.jpg`
    );
    // create a post
    let create_post = await post.create(
      {
        title,
        description,
        user_id: User.user_id,
      },
      { raw: true }
    );
    // check post created or not
    if (!create_post)
      throw new Error(
        "Post Not uploaded. There is an error. Please try after some time"
      );

    let filename = file.originalname;
    let post_id = create_post.post_id;
    // upload  a file with arguments
    uploadFile(filepath, filename, post_id)
      .then(() => console.log("Post uploaded"))
      .catch(() => console.log("Post not uploaded"));

    res.json({ success: true, message: "Post uploaded. Please Refresh" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
