//This entire page is here as a gimmick so I can enter appointments manually for testing purposes

const mongoose = require('mongoose');
const Appointment = require('./models/Appointment');

mongoose.connect('mongodb://localhost/SmartHealthCareSystem', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error(err));

//Testing Appointment Data
const appointmentsData = [
  { doctor: 'Dr. Smith', date: new Date('2024-04-06'), time: '09:00 AM' },
  { doctor: 'Dr. Johnson', date: new Date('2024-04-07'), time: '10:00 AM' },
];

// Insert appointments into database
async function insertAppointments() {
  try {
    await Appointment.insertMany(appointmentsData);
    console.log('Appointments inserted successfully');
  } catch (error) {
    console.error('Error inserting appointments:', error);
  } finally {
    mongoose.connection.close();
  }
}

insertAppointments(); //Manually run this in the console before viewing
