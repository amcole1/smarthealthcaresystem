const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null } // Allows null initially
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
