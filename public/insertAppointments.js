const mongoose = require('mongoose');
const Doctor = require('./models/Doctor');
const Appointment = require('./models/Appointment');

mongoose.connect('mongodb://localhost/SmartHealthCareSystem', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error(err));

async function insertData() {
  try {
    const doctors = [
      { name: 'Dr. Smith', specialty: 'Cardiology' },
      { name: 'Dr. Johnson', specialty: 'Dermatology' },
      { name: 'Dr. Lee', specialty: 'General Practice' },
      { name: 'Dr. Chen', specialty: 'Neurology' },
      { name: 'Dr. Davis', specialty: 'Orthopedics' },
    ];

    // Insert doctors and receive the documents to use their IDs
    const createdDoctors = await Doctor.insertMany(doctors);

    const appointmentsData = [];
    const times = ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'];

    // Generate appointments for next 7 days for each doctor at four time slots each day
    createdDoctors.forEach(doctor => {
      for (let i = 0; i < 7; i++) { // next 7 days
        const date = new Date();
        date.setDate(date.getDate() + i);
        times.forEach(time => {
          appointmentsData.push({ doctor: doctor._id, date: new Date(date), time });
        });
      }
    });

    // Insert all generated appointments
    await Appointment.insertMany(appointmentsData);
    console.log('Doctors and appointments inserted successfully');
  } catch (error) {
    console.error('Error inserting data:', error);
  } finally {
    mongoose.connection.close();
  }
}

insertData();
