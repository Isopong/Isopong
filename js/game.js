class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this.width = canvas.width;
    this.height = canvas.height;

    this.isoSkew = 0.5;

    // Table centered to canvas
    const tableWidth = 360;
    const tableHeight = 200;

    this.table = {
      x: this.width / 2,
      y: this.height / 2 + 40,

      left: this.width / 2 - tableWidth / 2,
      right: this.width / 2 + tableWidth / 2,
      top: this.height / 2 - tableHeight / 2,
      bottom: this.height / 2 + tableHeight / 2,

      isoSkew: this.isoSkew
    };

    // Paddle starts behind table
    this.paddle = new Paddle(
      this.table.left - 30,
      this.table.y
    );

    this.ball = new Ball(this.paddle, this.table);

    this.mouse = { x: this.paddle.x, y: this.paddle.y };

    canvas.addEventListener("mousemove", e => {
      const rect = canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });

    window.addEventListener("keydown", e => {
      if (e.key.toLowerCase() === "s") {
        this.ball.serve();
      }
    });

    this.lastTime = performance.now();
  }

  update(dt) {
    this.paddle.update(this.mouse.x, this.mouse.y, dt);
    this.ball.update(dt, this.paddle);
  }

  drawTable() {
    const t = this.table;
    const ctx = this.ctx;

    ctx.fillStyle = "#2e8b57";
    ctx.beginPath();
    ctx.moveTo(t.left, t.top * this.isoSkew);
    ctx.lineTo(t.right, t.top * this.isoSkew);
    ctx.lineTo(t.right, t.bottom * this.isoSkew);
    ctx.lineTo(t.left, t.bottom * this.isoSkew);
    ctx.closePath();
    ctx.fill();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    this.drawTable();
    this.ball.draw(this.ctx);
    this.paddle.draw(this.ctx, this.isoSkew);
  }

  loop = () => {
    const now = performance.now();
    const dt = (now - this.lastTime) / 1000;
    this.lastTime = now;

    this.update(dt);
    this.draw();

    requestAnimationFrame(this.loop);
  };
}
