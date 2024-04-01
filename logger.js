const fs = require('fs');
const path = require('path');
const { app } = require('electron');

// Define log file path. Use the appData directory for the application, but you can adjust this path.
const logFilePath = path.join(app.getPath('appData'), 'electron-polly', 'logs', 'app.log');

// Ensure the logs directory exists
const logDir = path.dirname(logFilePath);

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

log('log file path: ' + logFilePath);
log('log directory: ' + logDir);

// Simple log function
function log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} - ${message}\n`;
    // Append the log message to the log file
    fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) throw err; // If an error occurs, throw an exception.
    });
}

module.exports = log;
