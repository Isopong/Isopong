class Paddle {
  constructor(canvas) {
    this.canvas = canvas;

    this.x = 300;
    this.y = 270;

    this.prevX = this.x;
    this.prevY = this.y;

    this.vx = 0;
    this.vy = 0;

    this.width = 16;
    this.height = 96;

    this.image = new Image();
    this.image.src = "assets/sprites/paddle.png";

    this.mouseX = this.x;
    this.mouseY = this.y;

    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      this.mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
      this.mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);
    });
  }

  update(dt) {
    // Save previous position
    this.prevX = this.x;
    this.prevY = this.y;

    // Paddle speed smoothing (so the paddle doesnt )
    const smoothing = 0.35;
    this.x += (this.mouseX - this.x) * smoothing;
    this.y += (this.mouseY - this.y) * smoothing;

    // Calculate paddle velocity
    this.vx = (this.x - this.prevX) / dt;
    this.vy = (this.y - this.prevY) / dt;

    // Clamp to playable court. Set boundaries.
    this.x = Math.max(80, Math.min(880, this.x));
    this.y = Math.max(60, Math.min(500, this.y));
  }

  draw(ctx) {
    if (!this.image.complete) return;

    ctx.drawImage(
      this.image,
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
  }
}
