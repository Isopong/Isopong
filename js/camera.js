class Camera {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = 0;
        this.y = 0;
        this.target = null;
    }

    update() {
        if (!this.target) return;

        // tiny horizontal pan only, doesn't fly out of control like last time yay
        const maxPan = 24;
        const desiredX = (this.target.pos.x - this.canvas.width / 2) * 0.05;

        this.x += (Math.max(-maxPan, Math.min(maxPan, desiredX)) - this.x) * 0.08;
    }

    apply(ctx) {
        ctx.translate(-Math.round(this.x), 0);
    }
}
