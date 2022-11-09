const { register } = require("./signup/signup");
const { login, Verify } = require("./Login/login");
const { Post_a_Story } = require("./post/post_a_story");
const { deleteUploadedFile } = require("./post/deleteFile");
const { getUploadedPost } = require("./post/getUploadedposts");
module.exports = {
  register,
  getUploadedPost,
  Verify,
  login,
  deleteUploadedFile,
  Post_a_Story,
};
