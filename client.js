const fs = require('fs');
const net = require('net');
const progress = require('progress');
const { performance } = require('perf_hooks');

const PORT = 5001;
const FILE_PATH = 'download/file.bin'; // Update with your desired file path to save

const fileSize = fs.statSync(FILE_PATH).size; // Get file size
const progressBar = new progress('Downloading [:bar] :percent :etas', {
  complete: '=',
  incomplete: ' ',
  width: 50,
  total: fileSize
});

let lastBytesRead = 0;
let lastUpdateTime = performance.now();

const fileStream = fs.createWriteStream(FILE_PATH);
const socket = net.connect(PORT, 'serveo.net', () => {
  console.log('Connected to server.');

  socket.on('data', (data) => {
    fileStream.write(data);
    const bytesRead = socket.bytesRead;
    const speed = bytesRead - lastBytesRead;
    lastBytesRead = bytesRead;
    progressBar.tick(speed);
  });

  socket.on('end', () => {
    console.log('File received successfully.');
    fileStream.end();
    socket.destroy();
  });

  socket.on('error', (err) => {
    console.error('Socket error:', err);
  });
});
