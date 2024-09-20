const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/TourModel');
const appError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
exports.getCheckOutSession = catchAsync(async (req, res, next) => {
  //1 get  the cuurently booked tour
  const tour = await Tour.findById(req.params.tourId);
  if (!tour) return next(new appError('tour could not be found ', 404));
  //2/ create the session stripe.checkout.sessions.create
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'], // Specify payment methods allowed
    success_url: `${req.protocol}://${req.get('host')}`, // Redirect after success
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`, // Redirect after cancel
    customer_email: req.user.email, // Use the user's email from your authentication system
    client_reference_id: req.params.tourId, // Pass in the tour ID as a reference
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: tour.price * 100,
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [
              `https://www.natours.dev/img/tours/tour-5cdb06c8d87ca1051d90eda9-1557860998505-cover.jpeg`,
            ],
          },
        },
      },
    ],
    mode: 'payment',
  });
  //3 send it to client as res
  res.status(200).json({
    status: 'success',
    session,
  });
});
