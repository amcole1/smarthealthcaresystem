const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // User Information section
  userInfo: {
    firstName: { type: String, default: 'First Name' },
    lastName: { type: String, default: 'Last Name' },
    dob: {
      month: { type: Number, default: 1 },
      day: { type: Number, default: 1 },
      year: { type: Number, default: 1990 },
    },
    gender: { type: String, default: 'Prefer not to say' },
    address: {
      streetNumber: { type: String, default: '000' },
      streetName: { type: String, default: 'Main Street' },
      zipCode: { type: String, default: '00000' },
      city: { type: String, default: 'City' },
      state: { type: String, default: 'State' },
    },
    phoneNumber: { type: String, default: '000-000-0000' },
  },
  // Medical Information
  medicalInfo: {
    medication: [{
      name: { type: String, default: 'Medication Name' },
      frequency: { type: String, default: 'Daily' },
      dosage: { type: String, default: '1 pill' },
      prescribedDate: { type: Date, default: Date.now }, // Default to the current date
    }],
  },
  // Allergies Information
  allergiesInfo: {
    allergies: { type: [String], default: [] }, // Default to an empty array
  },

  appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }],
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
