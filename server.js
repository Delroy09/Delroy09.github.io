const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

const participants = new Map();
let currentResponses = [];

io.on('connection', (socket) => {
    socket.on('register', (name) => {
        participants.set(socket.id, name);
        socket.username = name;
    });

    socket.on('buzzer', (answer) => {
        const data = {
            name: socket.username,
            answer: answer,
            timestamp: Date.now()
        };
        currentResponses.push(data);
        
        // Sort responses by timestamp
        const sortedResponses = currentResponses
            .sort((a, b) => a.timestamp - b.timestamp)
            .slice(0, 3); // Get top 3
        
        io.emit('buzzer-press', {
            response: data,
            rankings: sortedResponses
        });
    });

    socket.on('new-question', (question) => {
        currentResponses = []; // Reset responses for new question
        io.emit('new-question', question);
    });

    socket.on('disconnect', () => {
        participants.delete(socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});