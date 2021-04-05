let testresponce = [1,2,3,4]
mapparse(testresponce);
function mapparse(x) {
    x.forEach(element => {
        rendertile(element);
    });
}
function rendertile(tiletype) {
    let tile = document.createElement("div");
    tile.innerHTML = "[_]";
    document.getElementById("tile-container").appendChild(tile);
}
