class Paddle {
  constructor(x) {
    this.x = x;
    this.y = 270;
    this.width = 16;
    this.height = 96;
    this.speed = 400;
    this.dy = 0;

    this.image = new Image();
    this.image.src = "assets/sprites/paddle.png";
  }

  update(dt, inputUp, inputDown) {
    this.dy = 0;
    if (inputUp) this.dy = -this.speed;
    if (inputDown) this.dy = this.speed;

    this.y += this.dy * dt;
    this.y = Math.max(80, Math.min(460, this.y));
  }

  draw(ctx) {
    ctx.drawImage(
      this.image,
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
  }
}
