const fs = require('fs');
const mongoose = require('mongoose');
mongoose.set('strictQuery', true)
require('dotenv').config();
const Trip = require('./trips');
console.log('MongoDB URI:', process.env.MONGODB_URI); 
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
