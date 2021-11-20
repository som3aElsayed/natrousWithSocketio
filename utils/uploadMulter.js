const multer = require("multer");
const AppError = require("./AppError");
const catchAsync = require("./catchAsync");
const sharp = require("sharp");
const path = require("path");
const uploadCloud = require("./cloudinary");
const deleteTheCreatedFile = require("./deleteTheCreatedFile");
exports.uploadMulter = () => {
  const storage = multer.memoryStorage();
  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new AppError("Not an image , Images are only allowed", 400), false);
    }
  };
  return multer({ storage, fileFilter });
};

exports.adjustifyOneImage = (width, height, tourOrUserFile) =>
  catchAsync(async (req, res, next) => {
    if (!req.file) return next();
    const userId = req.user.id;

    // here to  specify the path and then delete to clean up
    const pathFile = path.join(
      __dirname,
      `../public/natrous/${tourOrUserFile}/${tourOrUserFile}-${userId}-${Date.now()}.jpg`
    );

    // here edit the photo
    await sharp(req.file.buffer)
      .resize(width, height)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(pathFile);
    //      here upload it to cloudinary
    const image = await uploadCloud(pathFile);
    req.image = { image, pathFile };

    next();
  });

exports.adjustifyImages = (width, height) =>
  catchAsync(async (req, res, next) => {
    const imageCover = req.files.imageCover[0];
    const images = req.files.images;
    if (!imageCover || !images) return next();
    const userId = req.user.id;
    const pathFile = path.join(
      __dirname,
      `../public/natrous/tours/imageCover/-${userId}-${Date.now()}.jpg`
    );

    await sharp(imageCover.buffer)
      .resize(width, height)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(pathFile);

    const { secure_url, public_id } = await uploadCloud(pathFile);
    req.body.imageCover = {
      imageCover: secure_url,
      imageCover_cloudinary_id: public_id,
    };

    req.body.images = [];
    await Promise.all(
      images.map(async (image, index) => {
        const pathMainImages = path.join(
          __dirname,
          `../public/natrous/tours/images/${userId}-${Date.now()}-${index}.jpg`
        );
        await sharp(image.buffer)
          .resize(width, height)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(pathMainImages);

        const newlyUploadedMainTourImage = await uploadCloud(pathMainImages);
        deleteTheCreatedFile(pathMainImages);
        req.body.images.push({
          image_cloud_id: newlyUploadedMainTourImage.public_id,
          image: newlyUploadedMainTourImage.secure_url,
        });
      })
    );

    next();
  });

// refrecnce
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   }
// });
