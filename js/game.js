class Game {
    constructor(canvas) {
        this.ctx = canvas.getContext("2d");
        this.camera = new Camera();

        // Table sprite
        this.table = new Image();
        this.table.src = "assets/sprites/table.png";

        // Player paddle controlled by mouse
        this.paddle = new Paddle();

        // Ball
        this.ball = new Ball(this.paddle);

        this.lastTime = 0;
    }

    start() {
        requestAnimationFrame(this.loop.bind(this));
    }

    loop(timestamp) {
        const dt = (timestamp - this.lastTime) / 1000 || 0;
        this.lastTime = timestamp;

        this.update(dt);
        this.draw();

        requestAnimationFrame(this.loop.bind(this));
    }

    update(dt) {
        this.paddle.update(dt);
        this.ball.update(dt, this.paddle);
    }

    draw() {
        const ctx = this.ctx;
        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, 960, 540);

        // Draw table
        ctx.drawImage(this.table, 160, 80, 640, 380);

        // Draw ball and paddle
        this.ball.draw(ctx);
        this.paddle.draw(ctx);
    }
}
