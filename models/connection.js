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
// const mongoose = require('mongoose');
// require('dotenv').config(); // Charger les variables d'environnement

// const connectionString = process.env.MONGODB_URI; // URI de connexion à MongoDB

// const connectDB = async () => {
//   try {
//     await mongoose.connect(connectionString);
//     console.log('Database connected');
//   } catch (error) {
//     console.error('Database connection error:', error);
//     process.exit(1); // Terminer le processus en cas d'erreur de connexion
//   }
// };

// module.exports = connectDB; // Exporter la fonction de connexion
