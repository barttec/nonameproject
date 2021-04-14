const express = require('express');
const app = express();
app.use(express.static('.')); // this serves all files from the -public- directory

const server = require('http').createServer(app);// express gets injected to httpserver
const io = require('socket.io')(server);// socketio gets injected into webserver
const port = process.env.PORT || 3000;

io.on('connection', client => {
    
    let currentroomname = socketgetroomname(client)   
    
    client.on('thisisacustomeventsendbyuser', data => {
        /* … */
        console.log("client says: ",data);
        client.emit("echo", data)
    });
  	client.on('disconnect', () => {
        client.broadcast.emit('logout', {
            username: socket.username,
            nclients: nclients
        });
    });
});
server.listen(port);
console.log('server started at',port);

function socketgetroomname(self) {
    return self.rooms.keys().next().value
}