const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

//comment
const app = express();
const PORT = process.env.PORT || 5000;

console.log(`Attempting to listen on port: ${PORT}`);
app.listen(PORT, () => {
    console.log(`Server is successfully running on port ${PORT}`);
}).on('error', err => {
    console.error('Failed to start server:', err);
});


const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

const uri = process.env.MONGO_DB_URI;
const client = new MongoClient(uri, {
  tls:true,
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
    try {
        await client.connect();
        console.log('Successfully connected to MongoDB!');
        app.emit('ready');  // Emit 'ready' event when DB connection is established
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    }
}

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
      // Correct database name and collection name
      const collection = client.db('SE3Project').collection('smarthealthcaresystem.User');
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


app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
      // Updated DB and collection names
      const collection = client.db('SE3Project').collection('smarthealthcaresystem.User');
      const user = await collection.findOne({ username });
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

app.get('/api/user', authenticateToken, async (req, res) => {
    try {
        const collection = client.db('SE3Project').collection('smarthealthcaresystem'); // Adjust DB and collection names
        const user = await collection.findOne({ _id: req.userId }, { projection: { password: 0 } });
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.post('/api/appointments', authenticateToken, async (req, res) => {
    const { doctor, date, time } = req.body;
    try {
        const collection = client.db('SE3Project').collection('appointments'); // Adjust DB and collection names
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

app.get('/api/appointments', async (req, res) => {
    try {
        const today = new Date();
        const collection = client.db('SE3Project').collection('appointments'); // Adjust DB and collection names
        const appointments = await collection.find({ date: { $gte: today } }).sort({ date: 1 }).toArray();
        res.json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.delete('/api/appointments/:id', authenticateToken, async (req, res) => {
    try {
        const collection = client.db('SE3Project').collection('appointments'); // Adjust DB and collection names
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

run().catch(console.dir);

app.on('ready', () => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
