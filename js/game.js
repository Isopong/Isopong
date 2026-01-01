class Game {
  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.camera = new Camera();

    this.ball = new Ball();
    this.leftPaddle = new Paddle(120);
    this.rightPaddle = new Paddle(840);

    this.lastTime = 0;

    this.keys = {};
    window.addEventListener("keydown", e => this.keys[e.key] = true);
    window.addEventListener("keyup", e => this.keys[e.key] = false);

    this.table = new Image();
    this.table.src = "assets/sprites/table.png";
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
    this.ball.update(dt);

    this.leftPaddle.update(dt, this.keys["w"], this.keys["s"]);
    this.rightPaddle.update(dt, this.keys["ArrowUp"], this.keys["ArrowDown"]);
  }

  draw() {
    const ctx = this.ctx;

    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, 960, 540);

    // Table
    ctx.drawImage(this.table, 160, 80, 640, 380);

    this.ball.draw(ctx);
    this.leftPaddle.draw(ctx);
    this.rightPaddle.draw(ctx);
  }
}
