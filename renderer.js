// renderer.js

document.addEventListener('DOMContentLoaded', () => {
    if (!window.electronAPI.hasCredentials()) {
        document.getElementById('modalOverlay').style.display = 'flex';
    }

    document.getElementById('modalOverlay').addEventListener('click', function(event) {
        // If the user clicks directly on the overlay (and not on the modal content)
        if (event.target === this) {
            this.style.display = 'none';
        }
    });

    document.getElementById('awsCredentialsModal').addEventListener('click', function(event) {
        event.stopPropagation();
    });
    
    document.getElementById('saveAwsCredentials').addEventListener('click', () => {
        const credentials = {
          accessKeyId: document.getElementById('awsAccessKeyId').value,
          secretAccessKey: document.getElementById('awsSecretAccessKey').value,
          region: document.getElementById('awsRegion').value
        };
        window.electronAPI.saveCredentials(credentials);
        document.getElementById('modalOverlay').style.display = 'none';
        window.location.reload();
    });


    const updateCredentialsBtn = document.getElementById('updateAwsCredentials');
    updateCredentialsBtn.addEventListener('click', () => {
        document.getElementById('modalOverlay').style.display = 'flex';
    });

    const timestampCheckbox = document.getElementById('timestampCheckbox');
    timestampCheckbox.checked = window.electronAPI.getTimestampSetting(); // Set initial state

    timestampCheckbox.addEventListener('change', (event) => {
        window.electronAPI.setTimestampSetting(event.target.checked);
    });
    
    document.getElementById('btnStartProcess').addEventListener('click', async () => {
        const outputDirectory = document.getElementById('selectedDirPath').textContent.replace('Selected Directory: ', '');
        const outputPrefix = document.getElementById('outputPrefix').value;
        const voiceSelect = document.getElementById('voiceSelect').value;
        const speechRate = document.getElementById('speechRate').value;
        const speechPitch = document.getElementById('speechPitch').value;
        const fileInput = document.getElementById('txtFileInput');
        const appendTimestamp = document.getElementById('timestampCheckbox').checked;
        if (fileInput.files.length === 0) {
            alert('Please select a TXT file.');
            return;
        }
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const lines = e.target.result.split(/\r?\n/);
            console.log(`Total lines: ${lines.length}`);
            window.electronAPI.startProcessing({
                lines: lines, 
                outputDirectory: outputDirectory, 
                outputPrefix: outputPrefix, 
                voiceSelect: voiceSelect, 
                speechRate: speechRate, 
                speechPitch: speechPitch,
                appendTimestamp: appendTimestamp 
            });
        };
        reader.onerror = (err) => console.error("Error reading file:", err);
        reader.readAsText(file);
    });

    window.electronAPI.onProgressUpdate((event, progress) => {
        document.getElementById('progressBar').value = progress.percentage;
        document.getElementById('progressMessage').textContent = progress.message;
    });

    window.electronAPI.onComplete((event, callback) => {
        document.getElementById('progressBar').value = 100;
        document.getElementById('progressMessage').textContent = callback;
    });

    window.electronAPI.onError((event, errorMessage) => {
        //document.getElementById('processingError').textContent = errorMessage;
        alert(`An error occurred: ${errorMessage}`);
    });
});
