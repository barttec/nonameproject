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
const debug = false;

io.on('connection', client => {
    if(debug){console.log("client connected");}
    
    // let idofsocket = socketgetroomname(client) // the defult room is the id of the socket client.id
    // console.log(idofsocket);

    client.on('joinroom', data => {

        let clientrooms = getrooms(client);
        //leave all previous rooms
        for (let index = 1; index < clientrooms.length; index++) { //set to 1 so we dont leave socket.id room
            const room = clientrooms[index];
            client.leave(room);
        }
        client.join(data);// join new rooms
        if(debug){console.log("client:", client.id, " joins room:", data);}
        client.emit("joinedroom", data);// echo sucessfull data back to clinet
    });

    client.on('setusername', data => {
        client.username = data;
        if(debug){console.log("client:", client.id, " is called:", client.username);}
        client.emit("namechanged", data);
    });
    
    client.on('roomclients', data => { // send back clients in current rooms
        let res = client.rooms;
        let rooms = getrooms(client);//get the custom room, not id room
        if(rooms.length < 2) {
            client.emit("roomclients", 0);
            return true
        }
        let room = rooms[1]; //second one is the custom one joined
        let clientidinroom = currentroomclients(room);
        let clientnames = getsocketnames(clientidinroom); // this array includes ids
        client.emit("roomclients", clientnames); // sends array of clients
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

function getrooms(self) { // returns an array of rooms
    return Array.from(self.rooms)
}
function getroomsglobal() {
    return Array.from(io.sockets.adapter.rooms)
    //this returns an array
    // [ 
    //     ['roomname', Set({socketid,socketid})],
    //     ['roomname', Set({socketid,socketid})]
    // ]
}

function currentroomclients(room) {
    return Array.from(io.sockets.adapter.rooms.get(room)) // sends back array with socket.id of each user
}
function getsocket(id) {
    return io.sockets.sockets.get(id)
}

function getsocketnames(listofids) {
    let listofnames = [];
    listofids.forEach(id => {
        socket = getsocket(id);
        let entry = [socket.username, id];
        listofnames.push(entry)
    });
    return listofnames
    // returns
    // [
    //     ['socketname','socketid'],
    //     ['socketname','socketid']
    //     ...
    // ]
}