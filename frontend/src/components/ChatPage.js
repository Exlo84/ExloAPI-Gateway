import React, { useState } from 'react';
import axios from 'axios'; // Import axios for HTTP requests

function ChatPage() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const sendMessage = async () => {
    try {
      // Make an HTTP POST request to the backend
      const response = await axios.post('http://localhost:3001/api/v1/chat/completions', {
        message: message
      });

      // Update the chatHistory state with the actual response from the backend
      // Extracting the 'text' from the first choice of the LLM's response
      const llmResponse = response.data.choices[0].text;
      setChatHistory([...chatHistory, { message, response: llmResponse }]);
      setMessage(''); // Clear input after sending
    } catch (error) {
      console.error('Error sending message to LLM:', error.message, error.stack);
      alert('Failed to send message. Please check the console for more details.');
    }
  };

  const handleInputChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSendClick = (event) => {
    event.preventDefault();
    if (message.trim() !== '') {
      sendMessage();
    }
  };

  return (
    <div className="chat-page p-4 flex justify-center items-center h-screen bg-gray-800">
      <div className="chat-history mb-4 w-full max-w-md">
        <ul className="bg-gray-700 text-white rounded-lg p-4">
          {chatHistory.map((entry, index) => (
            <li key={index} className="mb-2">
              <strong>You:</strong> <span className="text-green-400">{entry.message}</span>
              <br />
              <strong>Response:</strong> <span className="text-blue-300">{entry.response}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="chat-input w-full max-w-md">
        <input
          type="text"
          value={message}
          onChange={handleInputChange}
          placeholder="Type your message here..."
          className="border p-2 mr-2 w-3/4"
        />
        <button onClick={handleSendClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatPage;