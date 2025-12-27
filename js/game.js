class Game {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;

        // Images
        this.tableImg = new Image();
        this.tableImg.src = 'assets/sprites/table.png';

        this.ballImg = new Image();
        this.ballImg.src = 'assets/sprites/ball.png';

        this.shadowImg = new Image();
        this.shadowImg.src = 'assets/sprites/shadow.png';

        this.paddleImg = new Image();
        this.paddleImg.src = 'assets/sprites/paddle.png';

        this.bounds = {
            xMin: 100,
            xMax: canvas.width - 100,
            yMin: 80,
            yMax: canvas.height - 80
        };
    }

    init() {
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;

        this.ball = new Ball(cx, cy, this.ballImg, this.shadowImg, this.bounds);

        this.player = new Paddle(cx, this.bounds.yMax - 30, this.paddleImg, false);
        this.ai = new Paddle(cx, this.bounds.yMin + 30, this.paddleImg, true, 0.85);
        this.ai.target = this.ball;

        this.camera = new Camera(this.canvas);
        this.camera.target = this.ball;
    }

    update(dt) {
        this.ball.update(dt);
        this.player.update(dt);
        this.ai.update(dt);

        this.ball.hitByPaddle(this.player);
        this.ball.hitByPaddle(this.ai);

        this.camera.update();
    }

    draw() {
        const ctx = this.ctx;
        ctx.save();

        this.camera.apply(ctx);

        ctx.drawImage(
            this.tableImg,
            this.bounds.xMin,
            this.bounds.yMin,
            this.bounds.xMax - this.bounds.xMin,
            this.bounds.yMax - this.bounds.yMin
        );

        this.player.draw(ctx);
        this.ai.draw(ctx);
        this.ball.draw(ctx);

        ctx.restore();
    }
}
