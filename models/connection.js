const fs = require('fs');
const mongoose = require('mongoose');
mongoose.set('strictQuery', true)
require('dotenv').config();
const Trip = require('./trips');

// Connexion à MongoDB
const connectionString = process.env.CONNECTION_STRING; 
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
// require('dotenv').config(); // Chargez les variables d'environnement

// const mongoose = require('mongoose');
// mongoose.set('strictQuery', true);
// const connectionString = process.env.CONNECTION_STRING;

// // console.log('Connection string:', connectionString); // Vérifiez que ça ne soit pas undefined

// if (!connectionString) {
//     console.error('Connection string is undefined. Check your environment variables.');
//     process.exit(1); // Arrêtez le serveur si la chaîne est manquante
// }

// mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true, connectTimeoutMS: 2000 })
//     .then(() => console.log('Database connected'))
//     .catch(error => console.error('Database connection error:', error));

