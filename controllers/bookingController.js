const Booking = require("../models/Booking");
const Tour = require("../models/Tour");
const catchAsync = require("../utils/catchAsync");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
exports.createBookign = catchAsync(async (req, res, next) => {
  // console.log(req.params.tourId);
  const tour = await Tour.findById(req.params.tourId);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],

    cancel_url: `${process.env.FRONT_END}/tour/${tour.slugify}`,
    success_url: `${process.env.FRONT_END}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [`http://www.natours.dev/img/tours/${tour.imageCover}`],
        amount: tour.price * 100,
        currency: "usd",
        quantity: 1,
      },
    ],
  });
  res.status(200).json({ stataus: "success", session });
});
exports.getAllMyBooking = catchAsync(async (req, res, next) => {
  // console.log(req.params.tourId);
  const bookings = await Booking.find({ user: req.params.tourId });
  if (!bookings.length)
    return res.status(200).json({ msg: "no bookings to display" });
  const tourIDs = bookings.map((e) => e.tour);
  const tours = await Tour.find({ _id: { $in: { tourIDs } } });
  console.log(tours);

  res.status(200).json({ stataus: "success", tours });
});
