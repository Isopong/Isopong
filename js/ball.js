class Ball {
  constructor() {
    this.x = 480;
    this.y = 270;
    this.z = 0;
    this.vx = 240;
    this.vy = 120;
    this.vz = 320;
    this.radius = 6;
    this.gravity = -900;

    this.sprite = new Image();
    this.sprite.src = "assets/sprites/ball.png";

    this.shadow = new Image();
    this.shadow.src = "assets/sprites/shadow.png";
  }

  update(dt) {
    this.vz += this.gravity * dt;

    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.z += this.vz * dt;

    // Bounce on table
    if (this.z <= 0) {
      this.z = 0;
      this.vz *= -0.75;
    }
  }

  draw(ctx) {
    // Shadow (ONLY on table)
    ctx.globalAlpha = 0.5;
    ctx.drawImage(
      this.shadow,
      this.x - 10,
      this.y - 4,
      20,
      8
    );
    ctx.globalAlpha = 1;

    // Ball height offset
    ctx.drawImage(
      this.sprite,
      this.x - 6,
      this.y - this.z - 6,
      12,
      12
    );
  }
}
