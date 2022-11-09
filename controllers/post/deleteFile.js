const post = require("../../models");
const { deleteFile } = require("../../utils/uploadDrive");

exports.deleteUploadedFile = async (req, res) => {
  try {
    const { images } = req.body;
    console.log(images);
    if (!images.length) throw new Error("No images selected");
    const { User } = req;
    const { _id } = User;
    const deletedImages = await StoreFile.deleteMany({
      user_id: _id,
      image_id: { $in: images },
    });
    if (!deletedImages) throw new Error("No images deleted");
    images.forEach(async (image) => {
      await deleteFile(image);
    });
    res.json({
      success: true,
      message: "Images deleted successfully. Please Refresh",
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
