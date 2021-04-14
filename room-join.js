let specificroomjoin = confirm("join specific room?")
console.log(specificroomjoin)
let roomname;
if(specificroomjoin){
    roomname = prompt("roomname")
    socket.emit("joinroom", roomname)
}

socket.on("disconnect", () => {
    console.error("disconnected, attempting reconnection")
});
socket.on("connect", () => {
    socket.emit("joinroom", roomname)
    console.warn("reconnected to room", roomname);
})
socket.on("joinedroom", (data) => {
    alert("joined room", data)
})


