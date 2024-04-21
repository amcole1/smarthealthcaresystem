// File: insertAppointments.js

const mongoose = require('mongoose');
const Doctor = require('./models/doctor');
const Appointment = require('./models/appointment');

async function insertData() {
    mongoose.connect('mongodb://localhost/SmartHealthCareSystem', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(async () => {
      console.log('MongoDB Connected');
      try {
        const doctors = [
          { name: 'Dr. Smith', specialty: 'Cardiology' },
          { name: 'Dr. Johnson', specialty: 'Dermatology' },
          // more doctors...
        ];

        const createdDoctors = await Doctor.insertMany(doctors);
        const appointmentsData = [];
        const times = ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'];

        createdDoctors.forEach(doctor => {
          for (let i = 0; i < 7; i++) { // next 7 days
            const date = new Date();
            date.setDate(date.getDate() + i);
            times.forEach(time => {
              appointmentsData.push({ doctor: doctor._id, date: new Date(date), time });
            });
          }
        });

        await Appointment.insertMany(appointmentsData);
        console.log('Doctors and appointments inserted successfully');
      } catch (error) {
        console.error('Error inserting data:', error);
      } finally {
        mongoose.connection.close();
      }
    })
    .catch(err => console.error('MongoDB connection error:', err));
}

module.exports = insertData;
