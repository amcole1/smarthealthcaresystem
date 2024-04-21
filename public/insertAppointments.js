const mongoose = require('mongoose');
const Doctor = require('./models/Doctor');
const Appointment = require('./models/Appointment');

mongoose.connect('mongodb://localhost/SmartHealthCareSystem', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error(err));

// First, insert some doctors
async function insertData() {
  try {
    const doctor1 = await Doctor.create({ name: 'Dr. Smith', specialty: 'Cardiology' });
    const doctor2 = await Doctor.create({ name: 'Dr. Johnson', specialty: 'Dermatology' });

    const appointmentsData = [
      { doctor: doctor1._id, date: new Date('2024-04-06'), time: '09:00 AM' },
      { doctor: doctor2._id, date: new Date('2024-04-07'), time: '10:00 AM' },
    ];

    await Appointment.insertMany(appointmentsData);
    console.log('Doctors and appointments inserted successfully');
  } catch (error) {
    console.error('Error inserting data:', error);
  } finally {
    mongoose.connection.close();
  }
}

insertData();
