class Camera {
  constructor() {
    this.x = 0;
    this.y = 0;
  }

  apply(ctx) {
    ctx.translate(this.x, this.y);
  }

  reset(ctx) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
}
