function joinroom(roomname){
    socket.emit("joinroom", roomname);
}

socket.on("disconnect", () => {
    console.error("disconnected, attempting reconnection")
});
socket.on("connect", () => {
    socket.emit("joinroom", roomname)
    console.log("%creconnected to room: " +roomname, 'color: White ;background-color: green;padding: 5px;');
})
socket.on("joinedroom", (data) => {
    console.log("%cjoined room: " + data, 'color: White ;background-color: blue;padding: 5px;');
})

