// const express = require('express');
// const app = express();
// const PORT = process.env.PORT || 3000;

// app.get('/', (req, res) => {
//     res.send('Server is up and running!');
// });

//  iaxkshkr app.listen(PORT, () => {
//   44e76499-1be2-4cc1-88c9-2d1b38a7b6f9  console.log(`Server is running on port ${PORT}`);
// });

const mongoose = require('mongoose');
require('dotenv').config(); // Chargez les variables d'environnement

const connectionString = process.env.MONGODB_URI;

mongoose.connect(connectionString)
  .then(() => {
    console.log('Database connected successfully');
    mongoose.disconnect();
  })
  .catch((error) => {
    console.error('Database connection error:', error);
    process.exit(1);
  });
