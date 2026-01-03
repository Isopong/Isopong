class Ball {
  constructor(paddle, table) {
    this.table = table;

    this.radius = 6;
    this.gravity = -1600;

    this.sprite = new Image();
    this.sprite.src = "assets/sprites/ball.png";

    this.shadow = new Image();
    this.shadow.src = "assets/sprites/shadow.png";

    this.reset(paddle);
  }

  reset(paddle) {
    this.x = paddle.x + 30;
    this.y = paddle.y;
    this.z = 8;

    this.vx = 0;
    this.vy = 0;
    this.vz = 0;

    this.active = false;
    this.serving = true;
    this.onTable = true;
  }

  serve() {
    if (!this.serving) return;

    // Vertical toss ONLY
    this.vz = 520;
    this.vx = 0;
    this.vy = 0;

    this.active = true;
    this.serving = false;
  }

  update(dt, paddle) {
    // Waiting state (ball held near paddle)
    if (!this.active) {
      this.x = paddle.x + 30;
      this.y = paddle.y;
      this.z = 8;
      return;
    }

    // Gravity
    this.vz += this.gravity * dt;

    // Integrate
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.z += this.vz * dt;

    const t = this.table;

    const onSurface =
      this.x > t.left &&
      this.x < t.right &&
      this.y > t.top &&
      this.y < t.bottom;

    // Table bounce
    if (this.z <= 0 && onSurface) {
      this.z = 0;
      this.vz *= -0.75;
      this.onTable = true;
    } else if (this.z <= 0 && !onSurface) {
      // Ball fell off table
      this.active = false;
      this.serving = true;
      this.onTable = false;
      return;
    }

    // Paddle collision
    if (
      this.x + this.radius > paddle.x - paddle.width / 2 &&
      this.x - this.radius < paddle.x + paddle.width / 2 &&
      this.y + this.radius > paddle.y - paddle.height / 2 &&
      this.y - this.radius < paddle.y + paddle.height / 2 &&
      this.z < 18 &&
      this.vz <= 0
    ) {
      // Relative hit position on paddle
      const offsetY = (this.y - paddle.y) / (paddle.height / 2);

      // Velocity transfer (THIS is where "hard vs soft" comes from)
      this.vx += paddle.vx * 0.9 + 380;
      this.vy += paddle.vy * 0.75 + offsetY * 220;
      this.vz = Math.max(420, Math.abs(paddle.vz || 0) + 380);
    }
  }

  draw(ctx) {
    // Shadow only when over table
    if (this.onTable) {
      ctx.globalAlpha = 0.4;
      ctx.drawImage(
        this.shadow,
        this.x - 10,
        this.y * this.table.isoSkew - 4,
        20,
        8
      );
      ctx.globalAlpha = 1;
    }

    ctx.drawImage(
      this.sprite,
      this.x - this.radius,
      this.y * this.table.isoSkew - this.z - this.radius,
      this.radius * 2,
      this.radius * 2
    );
  }
}
