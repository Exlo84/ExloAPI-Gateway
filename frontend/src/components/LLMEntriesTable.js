import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddLLMEntryModal from './AddLLMEntryModal';
import EditLLMEntryModal from './EditLLMEntryModal';
import DeleteLLMEntryModal from './DeleteLLMEntryModal';
import loggingService from '../services/loggingService'; // Ensure logging service is imported

function LLMEntriesTable() {
  const [entries, setEntries] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/llm/list`)
      .then(response => {
        setEntries(response.data);
      })
      .catch(error => {
        console.error('Error fetching LLM entries:', error.message);
        console.error('Full error trace:', error);
        loggingService.logError({ message: 'Error fetching LLM entries', error: error.response ? error.response.data : error.message }); // Log the error with improved detail
      });
  };

  const handleAddEntry = (entry) => {
    axios.post(`${process.env.REACT_APP_API_URL}/llm/add`, entry)
      .then(() => {
        fetchEntries();
        loggingService.logAction({ action: 'LLM entry added successfully' }); // Log successful addition
      })
      .catch(error => {
        console.error('Error adding LLM entry:', error.message);
        console.error('Full error trace:', error);
        loggingService.logError({ message: 'Error adding LLM entry', error: error.response ? error.response.data : error.message }); // Log the error with improved detail
      });
  };

  const handleUpdateEntry = (updatedEntry) => {
    axios.put(`${process.env.REACT_APP_API_URL}/llm/edit/${updatedEntry.id}`, updatedEntry)
      .then(() => {
        fetchEntries();
        loggingService.logAction({ action: 'LLM entry updated successfully' }); // Log successful update
      })
      .catch(error => {
        console.error('Error updating LLM entry:', error.message);
        console.error('Full error trace:', error);
        loggingService.logError({ message: 'Error updating LLM entry', error: error.response ? error.response.data : error.message }); // Log the error with improved detail
      });
  };

  const handleDeleteEntry = (id) => {
    axios.delete(`${process.env.REACT_APP_API_URL}/llm/delete/${id}`)
      .then(() => {
        fetchEntries();
        loggingService.logAction({ action: 'LLM entry deleted successfully' }); // Log successful deletion
      })
      .catch(error => {
        console.error('Error deleting LLM entry:', error.message);
        console.error('Full error trace:', error);
        loggingService.logError({ message: 'Error deleting LLM entry', error: error.response ? error.response.data : error.message }); // Log the error with improved detail
      });
  };

  const handleSetActive = (id) => {
    axios.put(`${process.env.REACT_APP_API_URL}/llm/active/${id}`)
      .then(() => {
        fetchEntries();
        loggingService.logAction({ action: `LLM entry ${id} set as active successfully` }); // Log successful activation
        alert('LLM entry set as active successfully'); // Provide user feedback
      })
      .catch(error => {
        console.error('Error setting LLM entry as active:', error.message);
        console.error('Full error trace:', error);
        loggingService.logError({ message: 'Error setting LLM entry as active', error: error.response ? error.response.data : error.message }); // Log the error with improved detail
        alert('Error setting LLM entry as active. Please check the console for more details.'); // Provide user feedback
      });
  };

  return (
    <div className="container mx-auto p-4">
      <button onClick={() => setIsAddModalOpen(true)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add LLM Entry</button>
      <table className="min-w-full table-auto">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="px-4 py-2">Model</th>
            <th className="px-4 py-2">Base URL</th>
            <th className="px-4 py-2">API Key</th>
            <th className="px-4 py-2">Label</th>
            <th className="px-4 py-2">Active</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr key={index} className={`bg-gray-${index % 2 === 0 ? '700' : '600'} text-white`}>
              <td className="border px-4 py-2">{entry.model}</td>
              <td className="border px-4 py-2">{entry.base_url}</td>
              <td className="border px-4 py-2">{entry.api_key}</td>
              <td className="border px-4 py-2">{entry.label}</td>
              <td className="border px-4 py-2">
                {entry.isActive ? (
                  <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <button onClick={() => handleSetActive(entry.id)} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded">Set Active</button>
                )}
              </td>
              <td className="border px-4 py-2">
                <button onClick={() => { setSelectedEntry(entry); setIsEditModalOpen(true); }} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">Edit</button>
                <button onClick={() => { setSelectedEntry(entry); setIsDeleteModalOpen(true); }} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <AddLLMEntryModal isOpen={isAddModalOpen} onRequestClose={() => setIsAddModalOpen(false)} onAddEntry={handleAddEntry} refreshEntries={fetchEntries} />
      {selectedEntry && <EditLLMEntryModal isOpen={isEditModalOpen} onRequestClose={() => setIsEditModalOpen(false)} entry={selectedEntry} onUpdateEntry={handleUpdateEntry} refreshEntries={fetchEntries} />}
      {selectedEntry && <DeleteLLMEntryModal isOpen={isDeleteModalOpen} onRequestClose={() => setIsDeleteModalOpen(false)} entry={selectedEntry} onDeleteEntry={() => handleDeleteEntry(selectedEntry.id)} refreshEntries={fetchEntries} />}
    </div>
  );
}

export default LLMEntriesTable;