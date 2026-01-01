class Camera {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.scale = 1;
    }

    reset(ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    apply(ctx) {
        ctx.setTransform(
            this.scale,
            0,
            0,
            this.scale,
            this.x,
            this.y
        );
    }
}
