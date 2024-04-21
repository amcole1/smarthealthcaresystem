const mongoose = require('mongoose');
const Doctor = require('./models/Doctor');
const Appointment = require('./models/Appointment');

mongoose.connect('your-mongodb-atlas-connection-string', { // Replace with your MongoDB Atlas connection string
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error(err));

// First, insert some doctors and appointments
async function insertData() {
  try {
    // Creating doctor entries
    const doctors = [
      { name: 'Dr. Smith', specialty: 'Cardiology' },
      { name: 'Dr. Johnson', specialty: 'Dermatology' },
      { name: 'Dr. Evans', specialty: 'Pediatrics' },
      { name: 'Dr. Miller', specialty: 'General Practice' }
    ];

    const doctorDocs = await Doctor.insertMany(doctors);
    console.log('Inserted doctors:', doctorDocs);

    // Creating corresponding appointments
    const appointmentsData = [
      { doctor: doctorDocs[0]._id, date: new Date('2024-06-01'), time: '09:00 AM' },
      { doctor: doctorDocs[0]._id, date: new Date('2024-06-01'), time: '11:00 AM' },
      { doctor: doctorDocs[1]._id, date: new Date('2024-06-02'), time: '10:00 AM' },
      { doctor: doctorDocs[2]._id, date: new Date('2024-06-03'), time: '01:00 PM' },
      { doctor: doctorDocs[3]._id, date: new Date('2024-06-04'), time: '02:00 PM' }
    ];

    const appointments = await Appointment.insertMany(appointmentsData);
    console.log('Inserted appointments:', appointments);
  } catch (error) {
    console.error('Error inserting data:', error);
  } finally {
    mongoose.connection.close();
  }
}

insertData();
