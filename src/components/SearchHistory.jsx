import React from 'react';
import { Clock, MapPin, Thermometer, Trash2, Cloud } from 'lucide-react';

function SearchHistory({ searches, onDelete }) {
  if (searches.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          Search History
        </h2>
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          No search history yet
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-blue-600" />
        Search History
      </h2>
      <div className="bg-white rounded-lg shadow divide-y divide-gray-100">
        {searches.map((search) => (
          <div
            key={search._id}
            className="p-4 hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-lg">{search.city}</h3>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  {new Date(search.timestamp).toLocaleString()}
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-gray-700">
                    <Thermometer className="w-4 h-4 text-red-500" />
                    <span>{search.temperature}°C</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-700">
                    <Cloud className="w-4 h-4 text-blue-500" />
                    <span>{search.weather}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onDelete(search._id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
                aria-label="Delete search"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchHistory;