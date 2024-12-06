var express = require('express');
var router = express.Router();
const { checkBody } = require('../modules/checkBody');
const Booking = require('../models/bookings');


router.put('/', async (req, res) => {
  const bookings = req.body; // Supposons que c'est un tableau d'objets

  // Vérifiez que chaque objet contient les champs requis
  for (let booking of bookings) {
    if (!checkBody(booking, ['tripId', 'isPaid'])) {
      return res.status(400).json({ result: false, error: 'Missing required fields' });
    }

    if (typeof booking.isPaid !== 'boolean') {
      return res.status(400).json({ result: false, error: 'isPaid must be a boolean' });
    }
  }

  try {
    // Mettez à jour toutes les réservations spécifiées
    const updatedBookings = await Promise.all(bookings.map(booking => 
      Booking.updateMany({ trip: booking.tripId }, { isPaid: booking.isPaid })
    ));

    // Vérifiez si des réservations ont été modifiées
    const modifiedCounts = updatedBookings.map(result => result.modifiedCount).reduce((acc, count) => acc + count, 0);

    if (modifiedCounts > 0) {
      return res.status(200).json({ result: true, message: 'Bookings updated successfully' });
    } else {
      return res.status(404).json({ result: false, error: 'Bookings not found or already updated' });
    }
  } catch (err) {
    console.error('Error updating bookings:', err);
    return res.status(500).json({ result: false, error: 'Error updating bookings' });
  }
});




router.get('/', async (req, res) => {
  const isPaidParam = req.query.isPaid;
  
  // si isPaidParam est "true" ou "false"
  if (isPaidParam === 'true') {
    const bookings = await Booking.find({ isPaid: true }).populate('trip');

    if (bookings.length > 0) {
      return res.status(200).json({ result: true, bookings });
    } else {
      return res.status(404).json({ result: false, error: 'No bookings found' });
    }
  } else {
    // Si isPaidParam n'est pas "true", toutes les réservations ou un message d'erreur
    return res.status(400).json({ result: false, error: 'Invalid query parameter' });
  }
});

module.exports = router;
