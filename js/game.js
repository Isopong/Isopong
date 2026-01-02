class Game {
  constructor(canvas) {
    this.ctx = canvas.getContext("2d");

    this.table = new Image();
    this.table.src = "assets/sprites/table.png";

    this.paddle = new Paddle(canvas);
    this.ball = new Ball(this.paddle);

    this.lastTime = 0;

    window.addEventListener("keydown", (e) => {
      if (e.key.toLowerCase() === "s") {
        this.ball.serve();
      }
    });
  }

  start() {
    requestAnimationFrame(this.loop.bind(this));
  }

  loop(time) {
    const dt = (time - this.lastTime) / 1000 || 0;
    this.lastTime = time;

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

    ctx.drawImage(this.table, 160, 80, 640, 380);

    this.ball.draw(ctx);
    this.paddle.draw(ctx);
  }
}
