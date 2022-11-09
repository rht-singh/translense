const { google } = require("googleapis");
const { OAUTH } = require("../config_server/gdrive");
const { post } = require("../models");

const fs = require("fs");
const oauth2Client = OAUTH();
const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});

/**
 *
 * @param {*} fileId // file Id for get url
 * @param {*} post_id // post id required to update link
 * @param {*} filePath // required to delete file after upload
 */
async function generatePublicUrl(fileId, post_id, filePath) {
  try {
    //change file permisions to public.
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    //obtain the webview and webcontent links
    const { data } = await drive.files.get({
      fileId: fileId,
      fields: "webViewLink, webContentLink",
    });

    // get post by id
    let postByID = await post.findOne({ where: { post_id } });
    // check post exist or not
    if (!postByID) throw new Error("Post Not Found");

    // save url of image of posted story
    postByID.image_url = data.webViewLink;
    await postByID.save();

    //delete file after upload a file
    fs.unlink(filePath, function (err) {
      if (err) return console.log(err);
      console.log("file deleted successfully");
    });
  } catch (error) {
    console.log(error.message);
  }
}

/**
 *
 * @param {*} path // where the file store at location
 * @param {*} filename // required to store a file at drive with name
 * @param {*} post_id // required to store a file link
 */
exports.uploadFile = async (path, filename, post_id) => {
  try {
    const response = await drive.files.create({
      requestBody: {
        name: filename, //file name
        parents: ["1E_5mJ9Le3akrRpE2u86xU9BCTlWLC8xH"],
        mimeType: "image/png",
      },
      media: {
        mimeType: "image/png",
        body: fs.createReadStream(path),
      },
    });
    // report the response from the request
    await generatePublicUrl(response.data.id, post_id, path);
  } catch (error) {
    console.log(error);
  }
};

exports.deleteFile = async (fileID) => {
  try {
    const response = await drive.files.delete({
      fileId: fileID, // file id
    });
    return response;
  } catch (error) {
    console.log(error.message);
  }
};
