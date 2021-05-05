
// var bulletarray = [];
// function fire(player) {
//     if(player.velocity.x > 0) {
//         player.velocity.x -= player.recoil*Math.random();
//     } else {
//         player.velocity.x += player.recoil*Math.random();
//     }
//     if(player.velocity.y > 0) {
//         player.velocity.y -= player.recoil*Math.random();
//     } else {
//         player.velocity.y += player.recoil*Math.random();
//     }

//     let velocity = JSON.parse(JSON.stringify(player.velocity));
    

//     var bullet = {
//         color: JSON.parse(JSON.stringify(player.color)),
//         x: JSON.parse(JSON.stringify(player.x)),
//         y: JSON.parse(JSON.stringify(player.y)),
//         velocity: velocity,
//         size: JSON.parse(JSON.stringify(player.size))
//     }
//     bulletarray.push(bullet);
// }

// function moveBullets() {
//     for (let index = 0; index < bulletarray.length; index++) {
//         let bullet = bulletarray[index];
        
//         let x1 = (bullet.x-bullet.size);
//         let y1 = (bullet.y-bullet.size);
//         let dx = bullet.size;
//         let dy = bullet.size;
//         drawRectangle(bullet.color, x1, y1, dx, dy)
//         // drawText(bullet.color,bullet.x+" "+bullet.y, bullet.x + 30, bullet.y + 30)

//         bullet.x = Math.floor((bullet.x + bullet.velocity.x)*100)/100;
//         bullet.y = Math.floor((bullet.y + bullet.velocity.y)*100)/100;

//         // delete on corner
//         if(bullet.x > canvas.width || bullet.y > canvas.height || bullet.x < 0 || bullet.y < 0){
//             console.log("destroy");
            
//             bulletarray.splice(index,1);
//         }
//     };
// }
