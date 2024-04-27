import axios from 'axios';

const API_BASE_URL = '/api/llm'; 

export default {
  listLLMEntries() {
    return axios.get(`${API_BASE_URL}/list`)
      .then(response => {
        console.log('LLM entries listed successfully.');
        return response;
      })
      .catch(error => {
        console.error('Failed to list LLM entries:', error.message);
        throw error;
      });
  },
  addLLMEntry(entry) {
    return axios.post(`${API_BASE_URL}/add`, entry)
      .then(response => {
        console.log('LLM entry added successfully.');
        return response;
      })
      .catch(error => {
        console.error('Failed to add LLM entry:', error.message);
        throw error;
      });
  },
  editLLMEntry(id, entry) {
    return axios.put(`${API_BASE_URL}/edit/${id}`, entry)
      .then(response => {
        console.log('LLM entry edited successfully.');
        return response;
      })
      .catch(error => {
        console.error('Failed to edit LLM entry:', error.message);
        throw error;
      });
  },
  deleteLLMEntry(id) {
    return axios.delete(`${API_BASE_URL}/delete/${id}`)
      .then(response => {
        console.log('LLM entry deleted successfully.');
        return response;
      })
      .catch(error => {
        console.error('Failed to delete LLM entry:', error.message);
        throw error;
      });
  },
  toggleActiveLLMEntry(id) {
    return axios.put(`${API_BASE_URL}/active/${id}`)
      .then(response => {
        console.log('LLM entry active state toggled successfully.');
        return response;
      })
      .catch(error => {
        console.error('Failed to toggle active state for LLM entry:', error.message);
        throw error;
      });
  }
};