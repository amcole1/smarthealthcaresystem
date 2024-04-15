const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  doctor: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
