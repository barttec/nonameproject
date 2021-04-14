const io = require("socket.io-client");
const socket = io("http://localhost:3000"); //the socket server will be determined forom the same domain via window.location object if not io("https://server-domain.com"); you can also specifiy namespaces to connect to and use wws: or https: via io("/admin");

socket.on("connect", (data) => {
    console.log('we in');
    socket.emit("thisisacustomeventsendbyuser", "this is sent by user"); 
});
socket.on("echo", (data) => {
    console.log("server says:", data);
});
