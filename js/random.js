function random(seed) {
    var x = Math.sin(seed || Math.random()) * 10000;
    return x - Math.floor(x);
}

function randomInt(seed, min, max) {
    return Math.floor(random(seed) * (max - min)) + min;
}
