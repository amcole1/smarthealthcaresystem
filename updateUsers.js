require('dotenv').config(); 
const mongoose = require('mongoose');
const User = require('./models/User'); 

const mongoURI = process.env.MONGO_DB_URI;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    updateUsers();
  })
  .catch(err => console.error('MongoDB connection error:', err));

async function updateUsers() {
  try {
   
    const result = await User.updateMany(
      {}, // filter to apply to all documents
      { $set: { fieldName: 'defaultValue' } } 
    );
    console.log('Updated documents:', result.modifiedCount);
  } catch (err) {
    console.error('Error updating users:', err);
  } finally {
    mongoose.connection.close();
  }
}
