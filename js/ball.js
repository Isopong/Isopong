class Ball {
    constructor(x, y, sprite, shadow, bounds) {
        this.sprite = sprite;
        this.shadow = shadow;
        this.bounds = bounds;

        this.pos = { x, y };
        this.vel = { x: 6 * (Math.random() > 0.5 ? 1 : -1), y: 7 };
        this.radius = 10;

        // Advanced physics
        this.z = 0;
        this.zVel = 0;
        this.gravity = 25;
        this.spin = { x: 0, y: 0 };
        this.airDrag = 0.995;
    }

    update(dt) {
        // Air physics
        this.vel.x += this.spin.x * dt;
        this.vel.y += this.spin.y * dt;

        this.vel.x *= this.airDrag;
        this.vel.y *= this.airDrag;

        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        // Vertical physics
        this.zVel -= this.gravity * dt;
        this.z += this.zVel;

        if (this.z < 0) {
            this.z = 0;
            this.zVel *= -0.6; // bounce damping
        }

        // Wall collisions
        if (this.pos.x < this.bounds.xMin || this.pos.x > this.bounds.xMax) {
            this.vel.x *= -1;
            this.spin.x *= 0.5;
        }
    }

    hitByPaddle(paddle) {
        const dx = this.pos.x - paddle.pos.x;
        const dy = this.pos.y - paddle.pos.y;
        const dist = Math.hypot(dx, dy);

        if (dist < this.radius + paddle.width / 2 && this.z < 12) {
            const angle = dx / paddle.width;
            const power = paddle.swingSpeed * 10;

            this.vel.x += angle * power;
            this.vel.y = paddle.isAI ? 6 : -6;

            this.zVel = Math.abs(paddle.swingSpeed) * 8;
            this.spin.x = angle * 0.2;
            this.spin.y = paddle.swingSpeed * 0.1;
        }
    }

    draw(ctx) {
        // Shadow
        ctx.globalAlpha = 0.3;
        ctx.drawImage(
            this.shadow,
            this.pos.x - this.radius,
            this.pos.y - this.radius + 6,
            this.radius * 2,
            this.radius
        );
        ctx.globalAlpha = 1;

        // Ball
        ctx.drawImage(
            this.sprite,
            this.pos.x - this.radius,
            this.pos.y - this.radius - this.z,
            this.radius * 2,
            this.radius * 2
        );
    }
}
