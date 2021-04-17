
// verify websockets work
if (window.WebSocket === undefined) {
   alert("sowwy websockets dont want to prlay wiith uss OWO, GET A DIFFRENT BROWSER")
}else {
   if (typeof String.prototype.startsWith != "function") {
      String.prototype.startsWith = function (str) {
         return this.indexOf(str) == 0;
      };
   }
    
   window.addEventListener("load", onLoad, false);
}
     
function onLoad() {
   var wsUri = "ws://192.168.1.51:6969";
   websocket = new WebSocket(wsUri);
   websocket.onopen = function(evt) { onOpen(evt) };
   websocket.onclose = function(evt) { onClose(evt) };
   websocket.onmessage = function(evt) { onMessage(evt) };
   websocket.onerror = function(evt) { onError(evt) };
}
function onError(evt) {console.error(evt.data);}function onOpen(evt) {console.log('conopen');}function onClose(evt) {console.log(evt);}

window.x = '';
function onMessage(evt) {
   var message = JSON.parse(evt.data).root;
   console.log(message);
   // mapparse(message)
}
function send(message) {
   websocket.send(message);
}
