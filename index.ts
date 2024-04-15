const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;

app.get('/', (_req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/room/:id', (_req, res) => {
    const id = _req.params.id;
    console.log(`room id: ${id}`);

    if (id === 'javascript') {
        res.sendFile(__dirname + '/public/javascript.html');
    } else if (id === 'css') {
        res.sendFile(__dirname + '/public/css.html');
    } else if (id === 'swift') {
        res.sendFile(__dirname + '/public/swift.html');
    }
});

const tech = io.of('/tech');
tech.on('connection', (socket: any) => {

    socket.on('join', (data: any) => {
        socket.join(data.room);
        tech.in(data.room).emit('message', `New user joined the room ${data.room}!`);
    });

    socket.on('message', (data: any) => {
        tech.in(data.room).emit('message', data.msg);
    });

    socket.on('disconnect', () => {
        tech.emit('message', 'user disconnected');
    });
});

server.listen(port, () => {
    console.log(`listening on *:${port}. http://localhost:${port}`);
});