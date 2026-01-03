class Ball {
  constructor(paddle) {
    this.radius = 6;

    this.x = paddle.x;
    this.y = paddle.y - 30;

    this.vx = 0;
    this.vy = 0;

    this.gravity = 900;

    this.state = "serve_hold"; // serve_hold → live

    this.sprite = new Image();
    this.sprite.src = "assets/sprites/ball.png";
  }

  serve() {
    if (this.state !== "serve_hold") return;

    this.vy = -300;
    this.vx = 0;
    this.state = "live";
  }

  update(dt, paddle) {
    if (this.state === "serve_hold") {
      // fully attach to paddle
      this.x = paddle.x;
      this.y = paddle.y - 30;
      return;
    }

    // gravity
    this.vy += this.gravity * dt;

    const prevX = this.x;
    const prevY = this.y;

    this.x += this.vx * dt;
    this.y += this.vy * dt;

    this.checkPaddleCollision(paddle, prevX, prevY);
  }

  checkPaddleCollision(paddle, bx0, by0) {
    const px0 = paddle.prevX;
    const py0 = paddle.prevY;
    const px1 = paddle.x;
    const py1 = paddle.y;

    // vector from paddle movement
    const dx = px1 - px0;
    const dy = py1 - py0;

    // relative ball position
    const fx = bx0 - px0;
    const fy = by0 - py0;

    const a = dx * dx + dy * dy;
    const b = 2 * (fx * dx + fy * dy);
    const c = fx * fx + fy * fy - (this.radius + paddle.width / 2) ** 2;

    let discriminant = b * b - 4 * a * c;
    if (discriminant < 0) return;

    discriminant = Math.sqrt(discriminant);
    const t = (-b - discriminant) / (2 * a);

    if (t < 0 || t > 1) return;

    // impact happened
    const hitVX = paddle.vx;
    const hitVY = paddle.vy;

    const speed = Math.hypot(hitVX, hitVY);
    if (speed < 20) return;

    // infer paddle face normal from motion
    const nx = hitVX / speed;
    const ny = hitVY / speed;

    // reflect ball velocity along paddle face
    const dot = this.vx * nx + this.vy * ny;
    this.vx = this.vx - 2 * dot * nx + hitVX * 0.4;
    this.vy = this.vy - 2 * dot * ny + hitVY * 0.4;

    // push ball out slightly to avoid sticking
    this.x += nx * 2;
    this.y += ny * 2;
  }

  draw(ctx) {
    ctx.drawImage(
      this.sprite,
      this.x - this.radius,
      this.y - this.radius,
      this.radius * 2,
      this.radius * 2
    );
  }
}
