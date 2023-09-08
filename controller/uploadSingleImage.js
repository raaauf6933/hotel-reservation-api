const cloudinary = require("cloudinary");
const fs = require("fs");

module.exports = async (req, res) => {
  let uploaded_images = [];
  //   let body = JSON.parse(req.body?.data);
  //   let { id } = body;

  try {
    const uploadImagePromise = () =>
      new Promise((resolve, reject) => {
        req.files.forEach(async (image) => {
          try {
            let upload_result = await cloudinary.v2.uploader.upload(
              image.path,
              {
                public_id: image.filename,
                folder: "ROOM_IMAGES",
              }
            );

         
            // fs.unlinkSync(image.path);
            uploaded_images.push({
              uid: upload_result.asset_id,
              name: upload_result.original_filename,
              status: "done",
              url: upload_result.secure_url,
            });
          } catch (error) {
            reject(error);
          }
          if (req.files.length === uploaded_images.length) {
            resolve();
          }
        });
      });

    await uploadImagePromise();

    res.status(200).send(uploaded_images);
  } catch (error) {
    res.status(400).send(error.message);
  }
};
