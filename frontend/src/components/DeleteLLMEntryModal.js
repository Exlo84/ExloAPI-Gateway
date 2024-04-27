import React from 'react';
import Modal from 'react-modal';
import axios from 'axios';

Modal.setAppElement('#root');

function DeleteLLMEntryModal({ isOpen, onRequestClose, entry, refreshEntries }) {
  const handleDelete = () => {
    axios.delete(`${process.env.REACT_APP_API_URL}/llm/delete/${entry.id}`)
      .then(() => {
        console.log(`LLM entry with id ${entry.id} deleted successfully.`);
        refreshEntries();
      })
      .catch(error => {
        console.error('Error deleting LLM entry:', error.message);
        console.error('Full error trace:', error.response || error);
      })
      .finally(() => {
        onRequestClose();
      });
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="bg-gray-800 p-5 rounded-lg">
      <h2 className="text-lg font-bold text-white">Delete LLM Entry</h2>
      <p className="text-white">Are you sure you want to delete this entry?</p>
      <div className="flex justify-end space-x-2 mt-4">
        <button onClick={handleDelete} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Delete
        </button>
        <button onClick={onRequestClose} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
          Cancel
        </button>
      </div>
    </Modal>
  );
}

export default DeleteLLMEntryModal;