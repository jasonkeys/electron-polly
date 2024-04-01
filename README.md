# Electron Polly App

This project is an Electron-based desktop application that integrates with AWS Polly to convert text to speech.

![Alt text](/icons/screenshot.png?raw=true "Electron Polly")

## Project Structure

- `main.js`: The entry point for the Electron app which creates the browser window and handles the main process.
- `preload.js`: Script that provides a safe way to expose Node.js features to the renderer process.
- `renderer.js`: Script that handles the renderer process, where the UI logic lives.
- `/dist`: Directory for the packaged builds of the application.

## Getting Started

### Prerequisites

- Node.js
- npm

### Setup

1. Clone the repository:
```
git clone https://github.com/yourusername/electron-polly.git
```
2. Navigate to the project directory:
```
cd electron-polly
```
3. Install dependencies:
```
npm install
```
### Run the App

To start the app in development mode, run:
```
npm start
```
## Debugging

Open the project in Visual Studio Code, and use the provided `launch.json` configuration to start debugging.

### `launch.json` for Visual Studio Code

In Visual Studio Code, go to the Run and Debug view, and create a launch.json file by clicking on "create a launch.json file". Here's a sample launch.json that includes configurations for the main and renderer processes:

```
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Debug Main Process",
            "type": "node",
            "request": "launch",
            "cwd": "${workspaceFolder}",
            "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/electron",
            "windows": {
              "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/electron.cmd"
            },
            "runtimeArgs": [
                "--inspect=9223",
                "."
              ],
            "args" : ["."],
            "outputCapture": "std",
            "console": "integratedTerminal",
            //"protocol": "inspector",
            "skipFiles": [
              "<node_internals>/**"
            ]
        },
        {
            "name": "Debug Renderer Process",
            "type": "chrome",
            "request": "attach",
            "port": 9222,
            "webRoot": "${workspaceFolder}"
        }
    ]
}
```

This configuration allows you to attach the debugger to the Electron main and renderer processes. Make sure you have the Debugger for Chrome extension installed in VS Code if you plan to debug the renderer process.

## Building

You can run a build targeted at specific platforms using this command:
```
npm run dist -- -m -w
```
In this example, we are building a package for Mac and Windows. Linux is also specified in the package.json build definitiion.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repository and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

![Alt text](/icons/logo.ico?raw=true "Electron Polly")

