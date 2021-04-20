const express = require('express');
const app = express();
const sanitizeHtml = require('sanitize-html');

app.get('/*', (req, res) => {
    let clean = sanitizeHtml(req.params[0]);
    if(clean == "") {
        clean = "index.html";
    }
    try {
        res.sendFile(clean, { root: "client" }); // send all other files as the files     
    } catch (error) {
        console.log(String(error).split("at Object.openSync")[0]);
    }
});

const server = require('http').createServer(app);// express gets injected to httpserver
const io = require('socket.io')(server);// socketio gets injected into webserver
const port = process.env.PORT || 3000;
const debug = false;

io.on('connection', client => {
    client.on('joinroom', (data) => {
        joinroom(client, data);
    });
    client.on('setusername', (data) => {
        setusername(client, data);
    });
    client.on('roomclients', (data) => { // send back clients in current rooms
        roomclients(client, data); // perhaps make it so that the client doesnt need to re send the request for players // make it so server imediatly sends roomclients on newjoin
    });
    client.on('playermove', (data) => {
        playermove(client, data);
    });
    client.on('positionFood', (data) => {
        positionFood(client, data);
    });
    client.on('disconnect', (data) => {
        disconnected(client, data);
    });

});
function joinroom(client, data) {
    let clientrooms = getrooms(client);
    //leave all previous rooms
    for (let index = 1; index < clientrooms.length; index++) { //set to 1 so we dont leave socket.id room
        const room = clientrooms[index];
        client.leave(room);
    }
    client.join(data);// join new rooms
    if(debug){console.log("client:", client.id, " joins room:", data);}
    client.currentroom = data;
    client.emit("joinedroom", data);// echo sucessfull data back to clinet
    brodcasttootherplayers(client, "newjoin"); // asks clients to re-request ammount of players
}
function setusername(client, data) {
    client.username = data;
    if(debug){console.log("client:", client.id, " is called:", client.username);}
    client.emit("namechanged", data);
    brodcasttootherplayers(client, "newjoin");// its as if someone new joined
}
function roomclients(client, data) {
    let res = client.rooms;
    let rooms = getrooms(client);//get the custom room, not id room
    if(rooms.length < 2) {
        client.emit("roomclients", []);
        return true
    }
    let room = rooms[1]; //second one is the custom one joined
    let clientidinroom = currentroomclients(room);
    let clientnames = getsocketnames(clientidinroom); // this array includes ids
    client.emit("roomclients", clientnames); // sends arryyyyyay of clients
}
function playermove(client, data) {
    brodcasttootherplayers(client, "playermove", data);
}
function disconnected(client, data) {
    if(debug){console.log('disconnect ',client.username);}
    // the "original" client no longer is in any rooms
    // we replace him with a copy which is a fake to only get previous room
    let fakeclient = new Object;
    fakeclient.rooms = [client.id,client.currentroom]        
    brodcasttootherplayers(fakeclient, "dcbruh", fakeclient);
}
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
function brodcasttootherplayers(client, event, data) {
    let room = getrooms(client)[1]; // get custom room of client
    io.to(room).emit(event,data); // the client when dc, is replaced with a fakeclient which only has room property
    //this is why we need server to send the message.
}
// data = [
//     ['socketname','socketid'],
//     ['socketname','socketid']
//     ...
// ]
// toall = false ? true
function sendroomtoclients(data, toall) {
    if(toall) {
        // send to everyone
    } else {
        // send to one
    }
}   