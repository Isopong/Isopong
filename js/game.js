class Game {
    constructor(canvas) {
        this.ctx = canvas.getContext("2d");
        this.camera = new Camera();

        // Table image
        this.table = new Image();
        this.table.src = "assets/sprites/table.png";

        // Paddles
        this.leftPaddle = new Paddle(120, false);    // player
        this.rightPaddle = new Paddle(840, true);    // AI

        // Ball
        this.ball = new Ball();

        this.lastTime = 0;
        this.keys = {};

        // Input
        window.addEventListener("keydown", e => this.keys[e.key] = true);
        window.addEventListener("keyup", e => this.keys[e.key] = false);
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
        this.ball.update(this.keys, this.leftPaddle, this.rightPaddle);

        // Player input
        this.leftPaddle.update(dt, this.ball, this.keys["w"], this.keys["s"]);
        // AI paddle
        this.rightPaddle.update(dt, this.ball);
    }

    draw() {
        const ctx = this.ctx;
        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, 960, 540);

        // Draw table
        ctx.drawImage(this.table, 160, 80, 640, 380);

        // Draw ball and paddles
        this.ball.draw(ctx);
        this.leftPaddle.draw(ctx);
        this.rightPaddle.draw(ctx);
    }
}
