import React from 'react';


function ForecastPage({ forecastData, loading, error }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-xl text-gray-600">Loading forecast data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">
        {error}
      </div>
    );
  }

  if (!forecastData) {
    return (
      <div className="text-center text-gray-600">
        <p className="text-xl">No forecast data available</p>
        <p className="mt-2">Search for a city on the home page to see its forecast</p>
      </div>
    );
  }

  const groupedForecast = forecastData.list.reduce((acc, item) => {
    let dateString = item.dt_txt.replace(" ", "T") + "Z"; // Ensure correct format
  
    const timestamp = Date.parse(dateString); // Use Date.parse()
    const date = new Date(timestamp); // Create Date object from timestamp
    console.log('Parsed Date:', date, 'dt_txt:', item.dt_txt); // Log to check
  
    if (isNaN(date.getTime())) { // Check if date is invalid
      console.log('Invalid date:', item.dt_txt);
      return acc;
    }
  
    const formattedDate = date.toLocaleDateString();
    if (!acc[formattedDate]) {
      acc[formattedDate] = [];
    }
    acc[formattedDate].push(item);
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        5-Day Weather Forecast for {forecastData.city.name}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(groupedForecast).map(([date, forecasts]) => (
          <div key={date} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-500 text-white p-3">
              <h3 className="font-bold">
                {new Date(date).toLocaleDateString('en-US', { 
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric'
                })}
              </h3>
            </div>
            
            <div className="p-4">
              {forecasts.map((forecast, index) => (
                <div 
                  key={index}
                  className={`${
                    index !== forecasts.length - 1 ? 'border-b' : ''
                  } py-2`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">
                      {new Date(forecast.dt_txt).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </span>
                    <span className="font-bold">
                      {Math.round(forecast.main.temp)}°C
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <img 
                      src={`http://openweathermap.org/img/w/${forecast.weather[0].icon}.png`}
                      alt={forecast.weather[0].description}
                      className="w-8 h-8"
                    />
                    <span className="text-sm text-gray-600 capitalize">
                      {forecast.weather[0].description}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-600">
                    <div>
                      Humidity: {forecast.main.humidity}%
                    </div>
                    <div>
                      Feels like: {Math.round(forecast.main.feels_like)}°C
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-center text-gray-600 text-sm">
        <p>Data provided by OpenWeatherMap</p>
        <p>Forecast is updated every 3 hours</p>
      </div>
    </div>
  );
}

export default ForecastPage;