import React from 'react';
import './index.css';
import LLMEntriesTable from './components/LLMEntriesTable';
import NavBar from './components/NavBar'; // Importing NavBar component
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Importing necessary components from react-router-dom
import SwaggerPage from './components/SwaggerPage'; // Importing SwaggerPage component
import ChatPage from './components/ChatPage'; // Importing ChatPage component for chat functionality

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar /> {/* Adding NavBar component to be displayed on all pages */}
        <Routes>
          <Route path="/" element={
            <>
              <header className="App-header">
                <h1 className="text-3xl font-bold underline text-white">
                  LLM Entries
                </h1>
              </header>
              <main>
                <LLMEntriesTable />
              </main>
            </>
          } />
          <Route path="/api-docs" element={<SwaggerPage />} />
          <Route path="/chat" element={<ChatPage />} /> {/* Adding route for ChatPage */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;