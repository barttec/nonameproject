const express = require('express');
const app = express();
const sanitizeHtml = require('sanitize-html');

app.get('/*', (req, res) => {
    let data = "404, page not found";
    let clean = sanitizeHtml(req.params[0]);
    if(clean == "") {
        clean = "index.html";
    }
    // console.log("request for", clean);
    try {
        res.sendFile(clean, { root: "." }); // send all other files as the files     
    } catch (error) {
        console.log(String(error).split("at Object.openSync")[0]);
    }
});

const server = require('http').createServer(app);// express gets injected to httpserver
const io = require('socket.io')(server);// socketio gets injected into webserver
const port = process.env.PORT || 3000;

io.on('connection', client => {
    console.log("client connected");
    
    // let idofsocket = socketgetroomname(client) // the defult room is the id of the socket client.id
    // console.log(idofsocket);
     

    client.on('joinroom', data => {
        console.log(data);
        client.join(data);
        console.log("client:", client.id, " joins room:", data);
        console.log(getallrooms());
        client.emit("joinedroom", data);
    });

    client.on('move', data => {
        console.log("client says: ", data);
        client.emit("playermove", data)
    });

    client.on('disconnect', () => {
        client.broadcast.emit('logout', {
            username: client.username
        });
    });

});

server.listen(port);
console.log('server started at',port);

function socketgetroomname(self) {
    return self.rooms.keys().next().value
}
function getallrooms() {
    return io.sockets.adapter.rooms
}