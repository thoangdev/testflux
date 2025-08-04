// Dashboard page placeholder
import React from 'react';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stats cards */}
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500">Total Tests</h3>
          <p className="text-2xl font-bold text-gray-900">1,234</p>
        </div>
        
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500">Pass Rate</h3>
          <p className="text-2xl font-bold text-success-600">94.2%</p>
        </div>
        
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500">Failed Tests</h3>
          <p className="text-2xl font-bold text-error-600">72</p>
        </div>
        
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500">Products</h3>
          <p className="text-2xl font-bold text-gray-900">8</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Charts will go here */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Recent Test Trends</h3>
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
            <p className="text-gray-500">Chart component will be implemented here</p>
          </div>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Test Results by Product</h3>
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
            <p className="text-gray-500">Chart component will be implemented here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
