class Camera {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = 0;
        this.y = 0;
        this.zoom = 1;
        this.target = null;
    }

    update() {
        if (!this.target) return;

        this.x += (this.target.pos.x - this.canvas.width / 2 - this.x) * 0.05;
        this.y += (this.target.pos.y - this.canvas.height / 2 - this.y) * 0.05;

        const targetZoom = 1 + this.target.z * 0.01;
        this.zoom += (targetZoom - this.zoom) * 0.05;
    }

    apply(ctx) {
        ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        ctx.scale(this.zoom, this.zoom);
        ctx.translate(-this.canvas.width / 2 + this.x, -this.canvas.height / 2 + this.y);
    }
}
