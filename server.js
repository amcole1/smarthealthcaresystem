const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const mongoose = require('mongoose');

const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
const uri = process.env.MONGO_DB_URI;


//Old Native Mongo DB connection
// const client = new MongoClient(uri, {
//     tls: true,
//     serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//     }
// });




/* Using Mongo DB for this, not Mongoose. I think this is where some errors are. Keeping it just incase.
async function run() {
    try {
        await client.connect();
        console.log('Successfully connected to MongoDB!');
        app.emit('ready');
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    }
}
*/
// Using Mongoose now instead of MongoDB
mongoose.connect(process.env.MONGO_DB_URI).then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error('MongoDB connection error:', err);
});



app.use(bodyParser.json());
app.use(express.static('public'));

/* Old api/register
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const collection = client.db('SE3Project').collection('users');
        const result = await collection.insertOne({ username, password: hashedPassword });
        if (result.insertedId) {
            res.status(201).send('User registered successfully');
        } else {
            throw new Error('User registration failed');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error registering new user');
    }
});
*/ 

// New Api/Register that pulls from the user model
app.post('/api/register', async (req, res) => {
  const { username, password, userInfo, medicalInfo, allergiesInfo } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
      const newUser = new User({
          username,
          password: hashedPassword,
          userInfo,
          medicalInfo,
          allergiesInfo
      });

      const savedUser = await newUser.save();
      console.log('User registered successfully:', savedUser);
      res.status(201).send('User registered successfully');
  } catch (error) {
      console.error('Error registering new user:', error);
      res.status(500).send('Error registering new user');
  }
});


//Old Api/Login using MongoDb
// app.post('/api/login', async (req, res) => {
//     const { username, password } = req.body;
//     try {
//         const collection = client.db('SE3Project').collection('users');
//         const user = await collection.findOne({ username });
//         if (!user) {
//             return res.status(401).send('User not found');
//         }
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(401).send('Invalid credentials');
//         }
//         const token = jwt.sign({ userId: user._id }, JWT_SECRET);
//         res.json({ token });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Login failed');
//     }
// });

// Using Mongoose to find the user during login instead of MongoDB
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
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
  } catch (error) {
      console.error(error);
      res.status(500).send('Login failed');
  }
});

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error("Token verification error:", err);
            return res.sendStatus(403);
        }
        req.userId = decoded.userId;
        next();
    });
};


//Old MongoDB
// app.get('/api/user', authenticateToken, async (req, res) => {
//     try {
//         const userId = new ObjectId(req.userId);
//         const collection = client.db('SE3Project').collection('users');
//         const user = await collection.findOne({ _id: userId }, { projection: { password: 0 } });
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//         res.json(user);
//     } catch (error) {
//         console.error('Database query error:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// Using Mongoose to retrieve user details
app.get('/api/user', authenticateToken, async (req, res) => {
  try {
      const user = await User.findById(req.userId).select('-password'); // Excludes password from the result
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
  } catch (error) {
      console.error('Database query error:', error);
      res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/appointments', authenticateToken, async (req, res) => {
    const { doctor, date, time } = req.body;
    try {
        const collection = client.db('SE3Project').collection('appointments');
        const result = await collection.insertOne({ doctor, date, time, user: req.userId });
        if (result.insertedId) {
            res.status(201).send('Appointment created successfully');
        } else {
            throw new Error('Appointment creation failed');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating appointment');
    }
});

app.get('/api/appointments', authenticateToken, async (req, res) => {
    try {
        const today = new Date();
        const collection = client.db('SE3Project').collection('appointments');
        const appointments = await collection.find({ date: { $gte: today } }).sort({ date: 1 }).toArray();
        res.json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.delete('/api/appointments/:id', authenticateToken, async (req, res) => {
    try {
        const collection = client.db('SE3Project').collection('appointments');
        const result = await collection.deleteOne({ _id: req.params.id, user: req.userId });
        if (result.deletedCount === 1) {
            res.status(200).send('Appointment deleted successfully');
        } else {
            return res.status(404).send('Appointment not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.on('ready', () => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

// Old Code for MongoDB, commenting it out and not deleting it.
//run().catch(console.dir);
