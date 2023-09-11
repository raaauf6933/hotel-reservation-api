const cloudinary = require("cloudinary");
const Bookings = require("./../models/bookings/bookings");

const { createEvent, eventType } = require("../helpers/events");

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
                folder: "BANK_RECEIPTS",
              }
            );
            // fs.unlinkSync(image.path);
            uploaded_images.push({ src: upload_result.secure_url });
          } catch (error) {
            reject(error);
          }
          if (req.files.length === uploaded_images.length) {
            resolve();
          }
        });
      });

    await uploadImagePromise();

    const update_image_object = await Bookings.findByIdAndUpdate(id, {
      $push: {
        events: createEvent(eventType.GUEST_IMAGE_UPLOAD, {
          images: uploaded_images[0],
        }),
      },
    });

    res.status(200).send(update_image_object);
  } catch (error) {
    res.status(400).send(error.message);
  }
};
