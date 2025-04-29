const { spawn } = require('child_process');
const fs = require('fs');

// Check if kill-port.js exists
if (!fs.existsSync('./kill-port.js')) {
  console.error('kill-port.js not found');
  process.exit(1);
}

// Run the kill-port script first
console.log('Checking for processes using port 5000...');
const killPort = spawn('node', ['kill-port.js']);

killPort.stdout.on('data', (data) => {
  console.log(`kill-port: ${data}`);
});

killPort.stderr.on('data', (data) => {
  console.error(`kill-port error: ${data}`);
});

killPort.on('close', (code) => {
  console.log(`kill-port process exited with code ${code}`);
  
  // Wait a moment for the port to be released
  setTimeout(() => {
    // Start the backend server
    console.log('Starting backend server...');
    const backend = spawn('npm', ['run', 'dev'], { stdio: 'inherit' });
    
    backend.on('close', (code) => {
      console.log(`Backend server exited with code ${code}`);
    });
  }, 1000);
}); 