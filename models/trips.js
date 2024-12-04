const mongoose = require('mongoose');
// import mongoose from 'mongoose';
const tripSchema = mongoose.Schema({
  departure: String,
  arrival: String,
  date: Date,
  price: Number,
  addedToCart: Boolean,
});

const Trip = mongoose.model('trips', tripSchema);

module.exports = Trip;
