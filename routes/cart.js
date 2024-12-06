var express = require('express');
var router = express.Router();

const Trip = require('../models/trips');
const Booking = require('../models/bookings');
const { checkBody } = require('../modules/checkBody');

router.post('/', async(req, res) => {
  // console.log("checkBody :", req.body)
  const missingFields = checkBody(req.body, ['tripId']); 
  if (!missingFields) {
    res.status(400).json({ result: false, error: 'Missing trip ID' });
    return;
  }

  try {
 const trip = await Trip.findById(req.body.tripId)
    if (trip) {
      const newBooking = new Booking({
        trip: trip._id,
        isPaid: false,
      });
    
    const booking = await newBooking.save()
        res.status(200).json({ result: true, booking });
    
    } else {
      res.status(404).json({ result: false, error: 'Trip not found' });
    }
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ result: false, error: 'Error creating booking' });
  }

})

router.get('/', async(req, res) => {
 const bookings = await Booking.find({ isPaid: false })
    .populate('trip')
       if (bookings.length > 0) {
        res.status(200).json({ result: true, bookings });
      } else {
        res.status(404).json({ result: false, error: 'No bookings found' });
      }
    });


    router.delete('/:id', async (req, res) => {
      try {
        const bookingId = req.params.id;
    
        // Supposons que vous ayez une méthode pour supprimer une réservation
        const result = await Booking.findByIdAndDelete(bookingId);
    
        if (!result) {
          return res.status(404).json({ result: false, error: 'Booking not found' });
        }
    
        // Ne pas renvoyer une réponse supplémentaire après cela
        res.status(200).json({ result: true, message: 'Booking deleted successfully' });
      } catch (err) {
        console.error('Error deleting booking:', err);
        res.status(500).json({ result: false, error: 'Error deleting booking' });
      }
    });
    

module.exports = router;
