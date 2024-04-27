import React from 'react';

function NavBar() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-white">
          Exloapi
        </div>
        <div className="flex">
          <a href="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</a>
          <a href="/models" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Models</a>
          <a href="/chat" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Chat</a>
          {/* Swagger UI Button - Placed on the right */}
          <a href="http://192.168.1.208:3001/api-docs/" target="_blank" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium ml-auto" rel="noopener noreferrer">Swagger UI</a> {/* INPUT_REQUIRED {Please replace "http://192.168.1.208:3001/api-docs/" with your actual Swagger UI hosted URL} */}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;