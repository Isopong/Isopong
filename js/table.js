// table.js

class Table {
  constructor(canvasWidth, canvasHeight) {
    // Table dimensions in pixels for now (placeholder)
    this.width = 320;   // Width on canvas
    this.height = 180;  // Depth on canvas

    // Center the table in the canvas
    this.x = (canvasWidth - this.width) / 2;
    this.y = (canvasHeight - this.height) / 2;

    // Bounds for collision (in canvas pixels for now)
    this.minX = this.x;
    this.maxX = this.x + this.width;
    this.minY = this.y;
    this.maxY = this.y + this.height;
  }

  // Check if a point is above table (pixel coords)
  isAbove(x, y) {
    return x >= this.minX && x <= this.maxX && y >= this.minY && y <= this.maxY;
  }

  // Draw the table as a green rectangle with a white net line
  draw(ctx) {
    // Table surface
    ctx.fillStyle = "#1e6f28"; // dark green
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Net line (center)
    const netX = this.x + this.width / 2;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(netX, this.y);
    ctx.lineTo(netX, this.y + this.height);
    ctx.stroke();
  }
}
