const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost:27017/F_Data', (err) => {  
//     if (!err)
//         console.log('MongoDB connection succeeded.');
//     else
//         console.log('Error in DB connection : ' + JSON.stringify(err, undefined, 2));
// });

// module.exports = mongoose;

const connectionString = 'mongodb://localhost:27017/F_Data'; // Replace with your own connection string

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
    // Start your application logic here
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
  module.exports = mongoose;
