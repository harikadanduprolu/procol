const { exec } = require('child_process');

// For Windows
exec('netstat -ano | findstr :5000', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
    return;
  }
  
  const lines = stdout.split('\n');
  if (lines.length > 0) {
    lines.forEach(line => {
      const parts = line.trim().split(/\s+/);
      if (parts.length > 4) {
        const pid = parts[4];
        console.log(`Killing process with PID: ${pid}`);
        exec(`taskkill /F /PID ${pid}`, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error killing process: ${error.message}`);
            return;
          }
          console.log(`Process killed: ${stdout}`);
        });
      }
    });
  } else {
    console.log('No process found using port 5000');
  }
}); 