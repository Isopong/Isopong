const canvas = document.getElementById("gameCanvas");
canvas.width = 800;
canvas.height = 600;
const ctx = canvas.getContext("2d");

const keys = {};
window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup', e => keys[e.key] = false);

const game = new Game(ctx);
game.init(canvas);

let lastTime = performance.now();

function loop(timestamp) {
    const dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    ctx.fillStyle = "#87CEEB"; // clear background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    game.update(dt);
    game.draw();

    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
