const mongoose = require('mongoose');
const Doctor = require('../models/doctor');
const Appointment = require('../models/appointment');


const uri = process.env.MONGO_DB_URI;

async function insertData() {
    mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: true, 
      authSource: 'admin' 
    })
    .then(async () => {
      console.log('MongoDB Connected to Atlas');
      try {
        const doctors = [
          { name: 'Dr. Smith', specialty: 'Cardiology' },
          { name: 'Dr. Johnson', specialty: 'Dermatology' },
          { name: 'Dr. Lee', specialty: 'General Practice' },
          { name: 'Dr. Chen', specialty: 'Neurology' },
          { name: 'Dr. Davis', specialty: 'Orthopedics' },
          { name: 'Dr. Patel', specialty: 'Pediatrics' },
          { name: 'Dr. Kim', specialty: 'Psychiatry' },
          { name: 'Dr. Thompson', specialty: 'Oncology' },
          { name: 'Dr. Garcia', specialty: 'Gastroenterology' },
          
        ];

        const createdDoctors = await Doctor.insertMany(doctors);
        const appointmentsData = [];
        const times = ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'];

        createdDoctors.forEach(doctor => {
          for (let i = 0; i < 7; i++) { 
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
