// Navbar component placeholder
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-primary-600">
              TestFlux
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link to="/" className="text-gray-700 hover:text-primary-600">
                Dashboard
              </Link>
              <Link to="/products" className="text-gray-700 hover:text-primary-600">
                Products
              </Link>
              <Link to="/results" className="text-gray-700 hover:text-primary-600">
                Results
              </Link>
              <Link to="/upload" className="text-gray-700 hover:text-primary-600">
                Upload
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="btn btn-secondary">Logout</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
