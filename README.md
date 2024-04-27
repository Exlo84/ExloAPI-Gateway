# Exloapi

Exloapi is a comprehensive web application designed to securely manage and proxy requests to external Large Language Models (LLMs), facilitating seamless integration and utilization of various LLMs through a single interface. It enables the secure storage of API keys, acts as a gateway for API requests, and provides a user-friendly interface for managing LLM entries. Built with JavaScript, React for the frontend, and Node.js with Express for the backend, and leveraging SQLite for database management, Exloapi stands out with its modern, responsive UI designed with Tailwind CSS and comprehensive logging with Winston.

## Overview

The application architecture is divided into a frontend and backend. The frontend is developed with React and styled using Tailwind CSS, offering a dark-themed modern user interface. The backend, created with Node.js and Express, handles API requests, manages the SQLite database, and securely proxies requests to the appropriate LLM based on incoming parameters. The project is structured to separate concerns, making it maintainable and scalable.

## Features

- **Secure API Key Storage**: API keys are securely stored and utilized for requests.
- **LLM Entry Management**: Users can add, edit, and delete LLM entries through a user-friendly interface.
- **Request Proxying**: The backend acts as a gateway, forwarding requests to LLMs based on stored entries.
- **Modern User Interface**: A responsive, dark-themed UI built with React and Tailwind CSS.
- **Comprehensive Logging**: Utilizes Winston for logging, aiding in monitoring and debugging.
- **Swagger API Documentation**: Integrated Swagger UI for easy access to API documentation and testing.

## Getting Started

### Requirements

- Node.js (version 14 or newer)
- npm (comes with Node.js)

### Quickstart

1. Clone the repository to your local machine.
2. Navigate to the project root directory.
3. Install dependencies for both the frontend and backend:
   - Run `npm install` in the root directory.
   - Navigate to the `frontend` directory and run `npm install`.
4. Start the application:
   - From the root directory, run `npm start`. This will concurrently start both the backend and frontend.
5. Access the application via `http://localhost:3000` (frontend) and `http://localhost:3001/api` (backend).

### License

Copyright (c) 2024.