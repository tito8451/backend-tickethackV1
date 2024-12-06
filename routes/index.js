var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
require('../models/connection');
const moment = require('moment');
const Trip = require('../models/trips');

router.get('/search/:departure/:arrival/:date', async (req, res) => {
  const { departure, arrival, date } = req.params;

  // console.log(`Searching for trips from ${departure} to ${arrival} on ${date}`);

  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    const trips = await Trip.find({
      departure: new RegExp(departure.trim(), 'i'),
      arrival: new RegExp(arrival.trim(), 'i'),
      date: { $gte: moment(date).startOf('day'), $lte: moment(date).endOf('day') },
    }).populate('trip');
    // console.log(`Searching for trips from ${departure.trim()} to ${arrival.trim()} on ${date}`);
    // console.log(`Departure query: ${new RegExp(departure.trim(), 'i')}`);
    // console.log(`Arrival query: ${new RegExp(arrival.trim(), 'i')}`);
    // console.log(`Date range: ${moment(date).startOf('day')} - ${moment(date).endOf('day')}`);
    // console.log(`Found trips:`, trips);

    if (trips.length > 0) {
      res.status(200).json({ result: true, trips });
    } else {
      res.status(404).json({ result: false });
    }
  } catch (err) {
    console.error('Error fetching trips:', err);
    console.error('Error searching trips:', err);
    res.status(500).json({ result: false, error: 'Error searching trips' });
  }
});


module.exports = router;
