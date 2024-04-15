const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const User = require('./models/User');
const Appointment = require('./models/appointment');

const app = express();
const PORT = 5000; // Using a fixed port for simplicity because the live sever was driving me up a wall

mongoose.connect('mongodb://localhost/SmartHealthCareSystem', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error(err));

app.use(bodyParser.json());
app.use(express.static('public'));


const JWT_SECRET = 'supersecretkey';

// User Registration
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error registering new user');
    }
});

// User Login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
        return res.status(401).send('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).send('Invalid credentials');
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.json({ token });
});

// Middleware for token authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log("Received token:", token); 

  if (token == null) return res.sendStatus(401); 

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
          console.error("Token verification error:", err);
          return res.sendStatus(403); 
      }
      console.log("Token is valid, user ID:", decoded.userId);
      req.userId = decoded.userId;
      next();
  });
};


// Fetch User Data
app.get('/api/user', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId, '-password'); 
        if (!user) return res.status(404).send('User not found');
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Update User Data
app.post('/api/user/update', authenticateToken, async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.userId, 
            { $set: req.body }, 
            { new: true, select: '-password' });
        if (!updatedUser) return res.status(404).send('User not found');
        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create Appointment - NEEDS TO BE DELETED
app.post('/api/appointments', authenticateToken, async (req, res) => {
  const { doctor, date, time } = req.body;
  const userId = req.userId;

  try {
    const appointment = new Appointment({ doctor, date, time, user: userId });
    await appointment.save();

      await User.findByIdAndUpdate(userId, { $push: { appointments: appointment._id } });

    res.status(201).send('Appointment created successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating appointment');
  }
});

// Get Appointments
app.get('/api/appointments', async (req, res) => {
  try {
    
    const today = new Date();
    
    const appointments = await Appointment.find({ date: { $gte: today } }).sort('date time');
    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Delete Appointment - NEEDS TO BE DELETED
app.delete('/api/appointments/:id', authenticateToken, async (req, res) => {
  const userId = req.userId;
  const appointmentId = req.params.id;

  try {
    // Ensure that the appointment belongs to the user before deleting
    const appointment = await Appointment.findOne({ _id: appointmentId, user: userId });
    if (!appointment) {
      return res.status(404).send('Appointment not found');
    }

    await appointment.remove();

    // Remove appointment reference from user
    await User.findByIdAndUpdate(userId, { $pull: { appointments: appointmentId } });

    res.status(200).send('Appointment deleted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
