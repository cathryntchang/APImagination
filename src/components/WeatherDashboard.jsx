import React, { useState } from 'react';
import { Search, MapPin, Thermometer, Droplets, Wind, CloudRain } from 'lucide-react';

function WeatherDashboard({ weatherData, loading, error, onSearch }) {
  const [city, setCity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city);
    }
  };

  const getWeatherIcon = (description) => {
    // You could expand this with more weather conditions
    if (description.includes('rain')) return <CloudRain className="w-12 h-12 text-blue-500" />;
    return <CloudRain className="w-12 h-12 text-blue-500" />;
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name..."
            className="w-full pl-10 pr-32 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 top-2 px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed shadow-sm"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Searching
              </div>
            ) : (
              'Search'
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg mb-4 flex items-center gap-2 animate-fade-in">
          <div className="flex-shrink-0">⚠️</div>
          {error}
        </div>
      )}

      {weatherData && (
        <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300">
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold">{weatherData.name}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                {getWeatherIcon(weatherData.weather[0].description)}
                <div>
                  <div className="text-5xl font-bold text-gray-900">
                    {Math.round(weatherData.main.temp)}°C
                  </div>
                  <div className="text-lg text-gray-600 capitalize">
                    {weatherData.weather[0].description}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <div className="flex items-center gap-3">
                <Thermometer className="w-5 h-5 text-orange-500" />
                <span className="text-gray-600">Feels like:</span>
                <span className="font-semibold">{Math.round(weatherData.main.feels_like)}°C</span>
              </div>

              <div className="flex items-center gap-3">
                <Droplets className="w-5 h-5 text-blue-500" />
                <span className="text-gray-600">Humidity:</span>
                <span className="font-semibold">{weatherData.main.humidity}%</span>
              </div>

              <div className="flex items-center gap-3">
                <Wind className="w-5 h-5 text-teal-500" />
                <span className="text-gray-600">Wind:</span>
                <span className="font-semibold">{weatherData.wind.speed} m/s</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WeatherDashboard;