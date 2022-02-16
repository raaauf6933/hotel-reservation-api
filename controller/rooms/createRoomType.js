const cloudinary = require("cloudinary");
const RoomTypes = require("../../models/rooms");
const fs = require("fs");

module.exports = async (req, res) => {
  // const room_details = JSON.parse(req.body.data);

  const data = req.body;

  // let uploaded_images = [];

  try {
    // Upload Image
    // const uploadImagePromise = () =>
    //   new Promise((resolve, reject) => {
    //     req.files.forEach(async (image) => {
    //       try {
    //         let upload_result = await cloudinary.v2.uploader.upload(
    //           image.path,
    //           {
    //             public_id: image.filename,
    //             folder: "ROOM_IMAGES",
    //           }
    //         );
    //         fs.unlinkSync(image.path);
    //         uploaded_images.push({ src: upload_result.url });
    //       } catch (error) {
    //         reject(error);
    //       }
    //       if (req.files.length === uploaded_images.length) {
    //         resolve();
    //       }
    //     });
    //   });

    // await uploadImagePromise();

    const room_types = new RoomTypes({
      name: data.name,
      details: {
        no_bed: data.no_bed,
        no_bath: data.no_bath,
        no_person: data.no_person,
        isAircon: data.isAircon,
        isKitchen: data.isKitchen,
      },
      room_rate: data.room_rate,
      images: [],
      rooms: [],
      status: data.status,
    });

    // Create Room Type
    let create_result = await room_types.save();

    res.status(200).send(create_result);
  } catch (error) {
    res.status(400).send(error.message);
  }
};
