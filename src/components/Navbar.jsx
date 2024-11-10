import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Cloud, SunMedium } from 'lucide-react';

function Navbar() {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between h-16">
          {/* Logo and Title */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-white hover:text-blue-100 transition-colors duration-200"
          >
            <Cloud className="h-6 w-6" />
            <span className="text-xl font-semibold">Weather Dashboard</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className={`flex items-center px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg
                ${isActive('/') 
                  ? 'text-white bg-blue-500 shadow-md' 
                  : 'text-blue-100 hover:text-white hover:bg-blue-500/50'
                }`}
            >
              <SunMedium className="w-4 h-4 mr-2" />
              Current Weather
            </Link>

            <Link
              to="/forecast"
              className={`flex items-center px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg
                ${isActive('/forecast')
                  ? 'text-white bg-blue-500 shadow-md'
                  : 'text-blue-100 hover:text-white hover:bg-blue-500/50'
                }`}
            >
              <Cloud className="w-4 h-4 mr-2" />
              5-Day Forecast
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;