import axios from 'axios';

const logError = (error) => {
  axios.post(`${process.env.REACT_APP_API_URL}/log/error`, { error })
    .then(() => console.log("Error logged successfully"))
    .catch(err => {
      console.error("Logging error failed", err.message);
      console.error('Full error trace:', err.response || err);
    });
};

const logAction = (action) => {
  axios.post(`${process.env.REACT_APP_API_URL}/log/action`, { action })
    .then(() => console.log("Action logged successfully"))
    .catch(err => {
      console.error("Logging action failed", err.message);
      console.error('Full error trace:', err.response || err);
    });
};

const loggingService = { logError, logAction };

export default loggingService;