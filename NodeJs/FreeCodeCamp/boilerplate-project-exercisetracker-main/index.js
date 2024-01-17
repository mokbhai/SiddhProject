const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const dataFilePath = path.join(__dirname, 'data.json');

// Load data from the JSON file on server start
let users = [];

function saveDataToFile() {
  fs.writeFileSync(dataFilePath, JSON.stringify(users), 'utf-8');
}

function loadDataFromFile() {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    users = JSON.parse(data);
  } catch (error) {
    // File doesn't exist or is invalid JSON, start with an empty array
    users = [];
  }
}
function generateRandomId() {
  const chars = '0123456789abcdef';
  let randomId = '';

  for (let i = 0; i < 24; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    randomId += chars.charAt(randomIndex);
  }

  return randomId;
}

// Load data from the JSON file on server start
loadDataFromFile();

// Helper function to find a user by ID
function findUserById(userId) {
  return users.find(user => user._id === userId);
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// Route to create a new user
app.post('/api/users', (req, res) => {
  const { username } = req.body;
  const newUser = { _id: generateRandomId(), username };
  users.push(newUser);
  saveDataToFile();
  res.json({ username: newUser.username, _id: newUser._id });
});

// Route to get a list of all users
app.get('/api/users', (req, res) => {
  res.json(users.map(user => ({ username: user.username, _id: user._id })));
});

// Route to add an exercise for a user
app.post('/api/users/:_id/exercises', (req, res) => {
  const userId = req.params._id;
  const user = findUserById(userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const { description, duration, date } = req.body;
  const exerciseDate = date ? new Date(date) : new Date();

  const newExercise = {
    username: user.username,
    description,
    duration: parseInt(duration),
    date: exerciseDate.toDateString(),
    _id: user._id,
  };

  if (!user.log) {
    user.log = [];
  }

  user.log.push(newExercise);

  saveDataToFile();

  res.json(newExercise);
});

// Route to get the full exercise log of a user
app.get('/api/users/:_id/logs', (req, res) => {
  const userId = req.params._id;
  const user = findUserById(userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const log = user.log || [];

  // Filter log based on from, to, and limit parameters
  const { from, to, limit } = req.query;
  let filteredLog = log.slice();

  if (from) filteredLog = filteredLog.filter(exercise => new Date(exercise.date) >= new Date(from));
  if (to) filteredLog = filteredLog.filter(exercise => new Date(exercise.date) <= new Date(to));
  if (limit) filteredLog = filteredLog.slice(0, parseInt(limit));

  const logResponse = {
    username: user.username,
    count: filteredLog.length,
    _id: user._id,
    log: filteredLog.map(exercise => ({
      description: exercise.description,
      duration: exercise.duration,
      date: exercise.date,
    })),
  };

  res.json(logResponse);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
