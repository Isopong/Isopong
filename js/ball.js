class Ball {
    constructor(x, y, sprite, shadow, bounds) {
        this.sprite = sprite;
        this.shadow = shadow;
        this.bounds = bounds;

        // Position
        this.pos = { x, y };
        this.z = 12; // start slightly above table

        // Velocity
        this.vel = { x: 7, y: 0 };
        this.zVel = 6;

        // Spin (radians/sec-ish, abstract units)
        this.spin = {
            x: 0, // sidespin
            y: 0  // topspin / backspin
        };

        this.radius = 8;

        // Physics constants (tuned for ping pong)
        this.gravity = 38;
        this.airDrag = 0.995;
        this.spinInfluence = 0.015;
        this.bounceDamping = 0.88;
        this.spinBounceTransfer = 0.35;
    }

    update(dt) {
        /* -------- AIR PHYSICS -------- */

        // Magnus effect (spin causes curve)
        this.vel.x += this.spin.x * this.spinInfluence;
        this.vel.y -= this.spin.y * this.spinInfluence;

        // Drag
        this.vel.x *= this.airDrag;
        this.vel.y *= this.airDrag;

        // Apply horizontal motion
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        /* -------- VERTICAL PHYSICS -------- */

        this.zVel -= this.gravity * dt;
        this.z += this.zVel;

        // Bounce off table
        if (this.z <= 0) {
            this.z = 0;

            // Bounce response
            this.zVel = -this.zVel * this.bounceDamping;

            // Spin ↔ velocity transfer on bounce
            this.vel.x += this.spin.x * this.spinBounceTransfer;
            this.vel.y -= this.spin.y * this.spinBounceTransfer;

            // Friction reduces spin
            this.spin.x *= 0.7;
            this.spin.y *= 0.7;

            // Kill tiny bounces
            if (Math.abs(this.zVel) < 1.5) {
                this.zVel = 0;
            }
        }

        /* -------- TABLE EDGE COLLISIONS -------- */

        if (this.pos.y < this.bounds.top || this.pos.y > this.bounds.bottom) {
            this.vel.y *= -0.9;
            this.spin.x *= -0.6;
        }
    }

    hitByPaddle(paddle) {
        const dx = Math.abs(this.pos.x - paddle.pos.x);
        const dy = Math.abs(this.pos.y - paddle.pos.y);

        if (
            dx < this.radius + paddle.width / 2 &&
            dy < paddle.height / 2 &&
            this.z < 14
        ) {
            const dir = paddle.isAI ? -1 : 1;

            // Core hit impulse
            this.vel.x = dir * (8 + Math.abs(paddle.swingSpeed) * 0.6);
            this.vel.y += paddle.swingSpeed * 0.35;

            // Lift
            this.zVel = 6 + Math.abs(paddle.swingSpeed) * 0.4;

            // Spin generation
            this.spin.y += paddle.swingSpeed * 0.08; // topspin/backspin
            this.spin.x += (this.pos.y - paddle.pos.y) * 0.002; // sidespin
        }
    }

    draw(ctx) {
        /* -------- SHADOW -------- */

        const shadowScale = Math.max(0.4, 1 - this.z / 40);

        ctx.globalAlpha = 0.35;
        ctx.drawImage(
            this.shadow,
            Math.round(this.pos.x - this.radius * shadowScale),
            Math.round(this.pos.y + 6),
            Math.round(this.radius * 2 * shadowScale),
            Math.round(this.radius * shadowScale)
        );
        ctx.globalAlpha = 1;

        /* -------- BALL -------- */

        ctx.drawImage(
            this.sprite,
            Math.round(this.pos.x - this.radius),
            Math.round(this.pos.y - this.radius - this.z),
            this.radius * 2,
            this.radius * 2
        );
    }
}
