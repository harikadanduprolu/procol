const { exec } = require('child_process');

console.log('Finding processes using port 5000...');

exec('netstat -ano | findstr :5000', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
    return;
  }
  
  console.log('Processes using port 5000:');
  console.log(stdout);
}); 