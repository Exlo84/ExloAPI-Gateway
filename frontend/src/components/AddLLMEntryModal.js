import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import loggingService from '../services/loggingService'; // Import the logging service

Modal.setAppElement('#root');

function AddLLMEntryModal({ isOpen, onRequestClose, refreshEntries }) {
  const [model, setModel] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [label, setLabel] = useState('');
  const [errors, setErrors] = useState({});

  const validateURL = (url) => {
    const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(url);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    loggingService.logAction({ action: 'Attempting to add LLM entry' }); // Log user action
    let formErrors = {};
    if (!model) formErrors.model = 'Model identifier is required';
    if (!baseUrl) {
      formErrors.baseUrl = 'Base URL is required';
    } else if (!validateURL(baseUrl)) {
      formErrors.baseUrl = 'Base URL must be a valid URL';
    }
    if (!apiKey) formErrors.apiKey = 'API Key is required';

    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      return;
    }

    const entry = { model, base_url: baseUrl, api_key: apiKey, label };
    axios.post(`${process.env.REACT_APP_API_URL}/llm/add`, entry)
      .then(response => {
        console.log('LLM entry added successfully', response.data);
        loggingService.logAction({ action: 'LLM entry added successfully' }); // Log successful addition
        if (typeof refreshEntries === 'function') {
          refreshEntries(); // Refresh the list of entries to include the newly added entry
        } else {
          console.error('refreshEntries is not a function');
          loggingService.logError({message: 'Error in AddLLMEntryModal', error: 'refreshEntries is not a function'});
        }
        onRequestClose(); // Close the modal after successful addition
      })
      .catch(error => {
        console.error('Error adding LLM entry:', error.message);
        console.error('Full error trace:', error.response || error);
        loggingService.logError({message: 'Error adding LLM entry', error: error.response ? error.response.data : error.message}); // Log the error with improved detail
        if (error.response && error.response.data && error.response.data.errors) {
          const apiErrors = error.response.data.errors.reduce((acc, currentError) => {
            acc[currentError.param] = currentError.msg;
            return acc;
          }, {});
          setErrors({ ...errors, ...apiErrors, api: 'Failed to add the LLM entry. Please check your input.' });
        } else {
          setErrors({ ...errors, api: 'Failed to add the LLM entry. Please try again.' });
        }
      });
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="bg-gray-800 p-5 rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-lg font-bold text-white">Add LLM Entry</h2>
        <div>
          <input
            type="text"
            placeholder="Model Identifier"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            required
            className={`p-2 rounded ${errors.model ? 'border-red-500' : ''}`}
          />
          {errors.model && <p className="text-red-500">{errors.model}</p>}
        </div>
        <div>
          <input
            type="text"
            placeholder="Base URL (e.g., https://example.com/api)"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            required
            className={`p-2 rounded ${errors.baseUrl ? 'border-red-500' : ''}`}
          />
          {errors.baseUrl && <p className="text-red-500">{errors.baseUrl}</p>}
        </div>
        <div>
          <input
            type="text"
            placeholder="API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            required
            className={`p-2 rounded ${errors.apiKey ? 'border-red-500' : ''}`}
          />
          {errors.apiKey && <p className="text-red-500">{errors.apiKey}</p>}
        </div>
        <div>
          <input
            type="text"
            placeholder="Label (Optional)"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="p-2 rounded"
          />
        </div>
        {errors.api && <p className="text-red-500">{errors.api}</p>}
        <div className="flex justify-end space-x-2">
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Add Entry
          </button>
          <button onClick={onRequestClose} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default AddLLMEntryModal;