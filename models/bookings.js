const mongoose = require('mongoose');
// import mongoose from 'mongoose';
const bookingSchema = mongoose.Schema({
  trip: { type: mongoose.Schema.Types.ObjectId, ref: 'trips' },
  isPaid: Boolean,
});

const Booking = mongoose.model('bookings', bookingSchema);

module.exports = Booking;
