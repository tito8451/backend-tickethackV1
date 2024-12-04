require('dotenv').config();

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var cartRouter = require('./routes/cart');
var bookingsRouter = require('./routes/bookings');

var app = express();
const fs = require('fs');
const mongoose = require('mongoose');
mongoose.set('strictQuery', true)
require('dotenv').config();
const Trip = require('./trips');

// Connexion à MongoDB
const connectionString = process.env.MONGODB_URI; 
// console.log(connectionString);
mongoose.connect(connectionString)
  .then(() => {
    console.log('Database connected');
    // Lire le fichier trips.json
    fs.readFile('trips.json', (err, data) => {
      if (err) {
        console.error("Error reading trips.json", err);
        return;
      }

      // Parser le JSON
      const trips = JSON.parse(data).map(trip => ({
        departure: trip.departure,
        arrival: trip.arrival,
        date: new Date(trip.date),
        price: trip.price
      }));

      // Insérer les trajets dans la base de données
      Trip.insertMany(trips)
        .then(() => {
          console.log('All trips have been added to the database.');
          // Fermez la connexion ici seulement si vous n'avez plus besoin d'interagir
          // mongoose.connection.close();
        })
        .catch(err => {
          console.error("Error inserting trips into the database", err);
        });
    });
  })
  .catch(error => {
    console.error('Database connection error:', error);
  });
const cors = require('cors');
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/cart', cartRouter);
app.use('/bookings', bookingsRouter);

module.exports = app;
