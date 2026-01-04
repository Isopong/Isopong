// game.js

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    // Initialize table
    this.table = new Table(canvas.width, canvas.height);

    // Start game loop
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  loop() {
    // Clear screen
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw table
    this.table.draw(this.ctx);

    // Next frame
    requestAnimationFrame(this.loop);
  }
}
