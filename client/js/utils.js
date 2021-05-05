function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
function getoneminusone() {
    return Math.ceil(Math.random() * 1) * (Math.round(Math.random()) ? 1 : -1)
}
function getRandom(precision) {
  return Math.round((Math.random()*precision))
}

// Accepts HEX COLOR with #FFFFFF
function colorsplit(color, gradient) {
    let HexRGB = color.split("#")[1].match(/.{1,2}/g);
    let colorNoise = getRandom(gradient)*getoneminusone();
    let rgb = {
        r: Math.floor(parseInt(HexRGB[0], 16) + colorNoise),
        g: Math.floor(parseInt(HexRGB[1], 16) + colorNoise),
        b: Math.floor(parseInt(HexRGB[2], 16) + colorNoise)
    }
    // console.log(colorNoise);
    return rgbToHex(rgb.r,rgb.g,rgb.b)
}
function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function getMagnitudeVelocity(playerObject) {
    let velocity = Math.round(Math.sqrt((playerObject.velocity.x*playerObject.velocity.x + playerObject.velocity.y*playerObject.velocity.y))*1000)/1000;
    return velocity;
}