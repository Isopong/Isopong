class Ball {
  constructor(paddle, table) {
    this.table = table;

    this.radius = 6;
    this.gravity = -1400;

    this.sprite = new Image();
    this.sprite.src = "assets/sprites/ball.png";

    this.shadow = new Image();
    this.shadow.src = "assets/sprites/shadow.png";

    this.reset(paddle);
  }

  reset(paddle) {
    this.x = paddle.x + 40;
    this.y = paddle.y;
    this.z = 12;

    this.vx = 0;
    this.vy = 0;
    this.vz = 0;

    this.active = false;
    this.bounceTimer = 0;
    this.onTable = true;
  }

  serve() {
    if (this.active) return;
    this.active = true;
    this.vx = 420;
    this.vy = 0;
    this.vz = 420;
  }

  update(dt, paddle) {
    if (!this.active) {
      this.bounceTimer += dt * 6;
      this.z = Math.abs(Math.sin(this.bounceTimer)) * 10;
      this.x = paddle.x + 40;
      this.y = paddle.y;
      return;
    }

    // Gravity
    this.vz += this.gravity * dt;

    // Integrate motion
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.z += this.vz * dt;

    // --- TABLE COLLISION ---
    const t = this.table;
    const onSurface =
      this.x > t.left &&
      this.x < t.right &&
      this.y > t.top &&
      this.y < t.bottom;

    if (this.z <= 0 && onSurface) {
      this.z = 0;
      this.vz *= -0.78;
      this.onTable = true;
    } else if (!onSurface && this.z <= 0) {
      // Ball fell off table
      this.onTable = false;
      this.z = 0;
      this.vz = 0;
    }

    // --- PADDLE COLLISION ---
    if (
      this.onTable &&
      this.x + this.radius > paddle.x - paddle.width / 2 &&
      this.x - this.radius < paddle.x + paddle.width / 2 &&
      this.y + this.radius > paddle.y - paddle.height / 2 &&
      this.y - this.radius < paddle.y + paddle.height / 2 &&
      this.z < 14
    ) {
      this.vx = Math.abs(this.vx) + Math.abs(paddle.vx) * 0.45;
      this.vy += paddle.vy * 0.35;
      this.vz = Math.max(this.vz, 320);
    }
  }

  draw(ctx) {
    // Shadow only if ball is over table
    if (this.onTable) {
      ctx.globalAlpha = 0.45;
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
