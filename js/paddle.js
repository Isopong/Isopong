class Paddle {
    constructor(x, y) {
        this.pos = { x, y };
        this.width = 16;
        this.height = 80;
    }

    update(mouse) {
        // Direct tracking (NO smoothing yet)
        this.pos.y = mouse.y;
        this.pos.x = mouse.x;
    }

    draw(ctx) {
        ctx.fillStyle = "#b03030";
        ctx.fillRect(
            this.pos.x - this.width / 2,
            this.pos.y - this.height / 2,
            this.width,
            this.height
        );
    }
}
