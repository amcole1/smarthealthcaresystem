const DoctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    specialty: { type: String, required: true }
  });
  
  module.exports = mongoose.model('Doctor', DoctorSchema);
  