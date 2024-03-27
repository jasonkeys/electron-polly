const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const AWS = require('aws-sdk');
const Store = require('electron-store');
const store = new Store();

// Initialize AWS Polly (adjust according to your configuration)
AWS.config.update({
  region: 'us-west-2'
});

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    },
  });

  //mainWindow.webContents.openDevTools();
  mainWindow.loadFile('index.html');
}

function initializeAwsSdk() {
  try {
    const awsCredentials = store.get('awsCredentials', null);
    if (awsCredentials) {
      AWS.config.update({
        accessKeyId: awsCredentials.accessKeyId,
        secretAccessKey: awsCredentials.secretAccessKey,
        region: awsCredentials.region
      });
    } else {
      throw new Error('AWS credentials are not set.');
    }
  } catch (error) {
    console.error(error);
    mainWindow.webContents.send('error', error.message);
  }
}

app.whenReady().then(() => {
    initializeAwsSdk();
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Handle TXT file selection
ipcMain.handle('dialog:openTXT', async () => {
  const { filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'TXT', extensions: ['txt'] }]
  });
  return filePaths[0];
});

// Handle Output Directory selection
ipcMain.handle('dialog:openDirectory', async () => {
    console.log('dialog:openDirectory');
  const { filePaths } = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });
  return filePaths[0]; // Return the first selected path
});

ipcMain.on('credentials:update', (event, credentials) => {
  store.set('awsCredentials', credentials);
  initializeAwsSdk(); // Re-initialize AWS SDK with new credentials
});

ipcMain.on('process:start', (event, args) => {
  try {
    console.log("Processing started with args:", args);
    const polly = new AWS.Polly({
      apiVersion: '2016-06-10'
    });
    const total = args.lines.length;
    const promises = args.lines.map(async (row, index) => {
        return new Promise((resolve, reject) => {
            const params = {
                OutputFormat: 'mp3',
                VoiceId: args.voiceSelect,
                Text: `<speak><prosody rate="${args.speechRate}" pitch="${args.speechPitch}">${row}</prosody></speak>`,
                TextType: 'ssml'
            };

            polly.synthesizeSpeech(params, (err, data) => {
                if (err) {
                    console.error('Error with Polly:', err);
                    reject(err);
                } else {
                    const timestamp = args.appendTimestamp ? `_${Math.floor(Date.now() / 1000)}` : '';
                    const prefix = `${args.outputPrefix}${row}${timestamp}.mp3`;
                    const filePath = path.join(args.outputDirectory, prefix);
                    fs.writeFileSync(filePath, data.AudioStream);
                    console.log(`File saved: ${filePath}`);
                    resolve();
                }
            });
        }).then(() => {
            const progressPercentage = ((index + 1) / total) * 100;
            const progress = { percentage: progressPercentage, message: `Completed file ${index + 1} of ${total}` };
            event.sender.send('process:progress', progress);
        });
    });

    Promise.all(promises).then(() => {
        console.log('All rows processed.');
        event.sender.send('process:complete', 'All processing complete.');
    }).catch(error => {
        console.error('Processing error:', error);
        event.sender.send('process:error', error.message);
    }); 
  } catch (error) {
    console.error('Processing error:', error);
    event.sender.send('process:error', error.message);
  }
});