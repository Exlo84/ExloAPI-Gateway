import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import LLMEntriesTable from './LLMEntriesTable';

jest.mock('axios');

describe('LLMEntriesTable Component', () => {
  it('renders the component', async () => {
    const mockData = {
      data: [
        {
          id: 1,
          model: 'testModel',
          base_url: 'https://example.com/api',
          api_key: '123456',
          label: 'Test Model',
        },
      ],
    };
    axios.get.mockResolvedValue(mockData);

    render(<LLMEntriesTable />);
    await waitFor(() => expect(screen.getByText('Add LLM Entry')).toBeInTheDocument());

    // Check if the mocked entry is displayed
    expect(screen.getByText('testModel')).toBeInTheDocument();
  });

  it('handles API fetch failure', async () => {
    axios.get.mockRejectedValue(new Error('Failed to fetch'));

    console.error = jest.fn(); // Mock console.error to avoid polluting test output

    render(<LLMEntriesTable />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));

    // Check if error logging is called
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Failed to fetch'));

    // Reset mock
    console.error.mockRestore();
  });

  // Additional tests for modal interactions and API calls can be added here
});