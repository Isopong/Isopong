// game.js
import { Ball } from "./ball.js";
import { Paddle } from "./paddle.js";
import { Camera } from "./camera.js";

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    // 🔒 Pixel-perfect rendering
    this.ctx.imageSmoothingEnabled = false;

    this.width = canvas.width;
    this.height = canvas.height;

    // =============================
    // TABLE DEFINITIONS
    // =============================

    // Actual playable table surface (NOT full image)
    this.table = {
      x: 160,
      y: 120,
      width: 480,
      height: 240,
      surfaceY: 260 // vertical screen position of table surface
    };

    this.netZ = 0.5; // normalized depth midpoint

    // =============================
    // ASSETS
    // =============================

    this.tableImg = new Image();
    this.tableImg.src = "assets/sprites/table.png";

    // =============================
    // GAME OBJECTS
    // =============================

    this.ball = new Ball(this.table);
    this.leftPaddle = new Paddle("left", this.table);
    this.rightPaddle = new Paddle("right", this.table);

    this.camera = new Camera(this.table);

    // =============================
    // TIME
    // =============================

    this.lastTime = performance.now();
  }

  update(dt) {
    this.leftPaddle.update(dt);
    this.rightPaddle.update(dt);

    this.ball.update(dt);

    // ---------- PADDLE COLLISIONS ----------
    this.ball.checkPaddleCollision(this.leftPaddle);
    this.ball.checkPaddleCollision(this.rightPaddle);

    // ---------- NET COLLISION ----------
    if (
      this.ball.z > this.netZ - 0.01 &&
      this.ball.z < this.netZ + 0.01 &&
      this.ball.y < this.table.surfaceY + 8
    ) {
      this.ball.vz *= -0.3;
      this.ball.vy *= 0.6;
    }

    // ---------- TABLE BOUNDS ----------
    if (!this.isBallOverTable()) {
      this.ball.leaveTable();
    }

    this.camera.update(this.ball);
  }

  isBallOverTable() {
    return (
      this.ball.x > this.table.x &&
      this.ball.x < this.table.x + this.table.width &&
      this.ball.z >= 0 &&
      this.ball.z <= 1
    );
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    this.camera.apply(ctx);

    // Draw table
    ctx.drawImage(
      this.tableImg,
      this.table.x,
      this.table.y
    );

    // Draw shadow ONLY if over table
    if (this.isBallOverTable()) {
      this.ball.drawShadow(ctx);
    }

    this.leftPaddle.draw(ctx);
    this.rightPaddle.draw(ctx);
    this.ball.draw(ctx);

    this.camera.reset(ctx);
  }

  loop() {
    const now = performance.now();
    const dt = Math.min((now - this.lastTime) / 1000, 0.016);
    this.lastTime = now;

    this.update(dt);
    this.draw();

    requestAnimationFrame(() => this.loop());
  }
}
