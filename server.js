const fs = require('fs');
const net = require('net');
const FILE_PATH = 'file.bin'; // Update with your desired file path to share

const server = net.createServer((socket) => {
  console.log('Client connected.');

  const fileStream = fs.createReadStream(FILE_PATH);
  fileStream.pipe(socket); // Pipe file stream to socket

  fileStream.on('end', () => {
    console.log('File sent successfully.');
    socket.end();
  });

  fileStream.on('error', (err) => {
    console.error('File stream error:', err);
    socket.end();
  });

  socket.on('error', (err) => {
    console.error('Socket error:', err);
    fileStream.destroy();
  });

  socket.on('end', () => {
    console.log('Client disconnected.');
  });
});

const PORT = 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is listening on port ${PORT}.`);
});
