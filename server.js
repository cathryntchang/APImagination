const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/weatherapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

const searchSchema = new mongoose.Schema({
  city: String,
  timestamp: { type: Date, default: Date.now },
  temperature: Number,
  weather: String,
  userId: String
});

const Search = mongoose.model('Search', searchSchema);

// Weather API endpoint
app.get('/api/weather', async (req, res) => {
  const { city } = req.query;
  const apiKey = process.env.API_KEY;

  if (!city) {
    return res.status(400).json({ message: 'City parameter is required' });
  }

  try {
    const currentResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`
    );
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`
    );

    const currentData = await currentResponse.json();
    const forecastData = await forecastResponse.json();

    if (currentData.cod === '404' || forecastData.cod === '404') {
      return res.status(404).json({ message: 'City not found' });
    }

    if (currentData.cod !== 200) {
      return res.status(currentData.cod).json({ message: currentData.message });
    }

    res.json({ current: currentData, forecast: forecastData });
  } catch (error) {
    console.error('Weather API error:', error);
    res.status(500).json({ message: 'Error fetching weather data', error: error.message });
  }
});

// Search history endpoints
app.post('/api/searches', async (req, res) => {
  try {
    const newSearch = new Search(req.body);
    await newSearch.save();
    res.status(201).json(newSearch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/searches', async (req, res) => {
  try {
    const searches = await Search.find().sort({ timestamp: -1 }).limit(10);
    res.json(searches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/searches/:id', async (req, res) => {
  try {
    await Search.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!', error: err.message });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});