const cloudinary = require("cloudinary");
const RoomTypes = require("../../models/rooms");
const fs = require("fs");

module.exports = async (req, res) => {
  let uploaded_images = [];
  let body = JSON.parse(req.body?.data);
  let { id } = body;

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
            fs.unlinkSync(image.path);
            uploaded_images.push({ src: upload_result.url });
          } catch (error) {
            reject(error);
          }
          if (req.files.length === uploaded_images.length) {
            resolve();
          }
        });
      });

    await uploadImagePromise();

    const get_room = await RoomTypes.findById(id);
    const update_image_object = await RoomTypes.findByIdAndUpdate(id, {
      images: [...get_room.images, ...uploaded_images],
    });

    res.status(200).send(update_image_object);
  } catch (error) {
    res.status(400).send(error.message);
  }
};
