const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// In-memory data store (replace this with a database in a real-world scenario)
let users = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// Route to create a new user
app.post('/api/users', (req, res) => {
  const { username } = req.body;

  // Validate input
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  // Create a new user object
  const user = {
    username,
    _id: generateUserId(), // Replace with a function to generate unique IDs
  };

  // Add the user to the data store
  users.push(user);

  // Respond with the created user object
  res.json(user);
});

// Route to get a list of all users
app.get('/api/users', (req, res) => {
  res.json(users);
});

// Route to add a new exercise to a user
app.post('/api/users/:_id/exercises', (req, res) => {
  const userId = req.params._id;
  const { description, duration, date } = req.body;

  // Validate input
  if (!description || !duration) {
    return res.status(400).json({ error: 'Description and duration are required' });
  }

  // Find the user by ID
  const user = users.find((u) => u._id === userId);

  // Check if the user exists
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Create the exercise object
  const exercise = {
    description,
    duration: parseInt(duration),
    date: date ? new Date(date).toDateString() : new Date().toDateString(),
  };

  // Add the exercise to the user's log
  if (!user.log) {
    user.log = [];
  }
  user.log.push(exercise);

  // Respond with the updated user object
  res.json(user);
});

// Route to get the exercise log of a user
app.get('/api/users/:_id/logs', (req, res) => {
  const userId = req.params._id;
  const { from, to, limit } = req.query;

  // Find the user by ID
  const user = users.find((u) => u._id === userId);

  // Check if the user exists
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Filter the log based on parameters
  let log = user.log || [];

  if (from) {
    log = log.filter((exercise) => new Date(exercise.date) >= new Date(from));
  }

  if (to) {
    log = log.filter((exercise) => new Date(exercise.date) <= new Date(to));
  }

  if (limit) {
    log = log.slice(0, parseInt(limit));
  }

  // Respond with the user object containing the filtered log
  res.json({ ...user, log });
});

// Helper function to generate a unique user ID (replace with a more robust solution)
function generateUserId() {
  return Math.random().toString(36).substr(2, 9);
}

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
