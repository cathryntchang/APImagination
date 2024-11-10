import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WeatherDashboard from './components/WeatherDashboard';
import SearchHistory from './components/SearchHistory';
import ForecastPage from './components/ForecastPage';
import Navbar from './components/Navbar';
import './index.css'

const BACKEND_URL = 'http://localhost:3000/api';

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    fetchSearchHistory();
  }, []);

  const fetchSearchHistory = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/searches`);
      setSearchHistory(response.data);
    } catch (error) {
      console.error('Error fetching search history:', error);
    }
  };

  const fetchWeatherData = async (city) => {
    try {
      setLoading(true);
      setError(null);

      // Call the backend endpoint
      const response = await axios.get(`${BACKEND_URL}/weather`, {
        params: { city }
      });

      const weatherData = response.data;
      setCurrentWeather(weatherData.current);
      setForecast(weatherData.forecast);

      // Save search to backend
      await axios.post(`${BACKEND_URL}/searches`, {
        city,
        temperature: weatherData.current.main.temp,
        weather: weatherData.current.weather[0].main
      });

      fetchSearchHistory();
    } catch (err) {
      setError('Error fetching weather data. Please try again.');
      console.error('Error:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteSearch = async (id) => {
    try {
      await axios.delete(`${BACKEND_URL}/searches/${id}`);
      fetchSearchHistory();
    } catch (error) {
      console.error('Error deleting search:', error);
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route 
              path="/" 
              element={
                <>
                  <WeatherDashboard
                    weatherData={currentWeather}
                    loading={loading}
                    error={error}
                    onSearch={fetchWeatherData}
                  />
                  <SearchHistory 
                    searches={searchHistory}
                    onDelete={deleteSearch}
                  />
                </>
              }
            />
            <Route 
              path="/forecast" 
              element={
                <ForecastPage
                  forecastData={forecast}
                  loading={loading}
                  error={error}
                />
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;