class Ball {
    constructor(x, y, sprite, shadow, bounds) {
        this.sprite = sprite;
        this.shadow = shadow;
        this.bounds = bounds;

        // Position
        this.pos = { x, y };
        this.z = 14;

        // Velocity
        this.vel = { x: 7, y: 0 };
        this.zVel = 6;

        // Spin
        this.spin = {
            side: 0,
            top: 0
        };

        this.radius = 8;

        // Physics tuning
        this.gravity = 40;
        this.airDrag = 0.994;
        this.magnus = 0.018;
        this.bounceLoss = 0.82;
        this.spinFriction = 0.65;

        // Net
        this.netX = (bounds.left + bounds.right) / 2;
        this.netHeight = 12;
    }

    isOverTable() {
        return (
            this.pos.x > this.bounds.left &&
            this.pos.x < this.bounds.right &&
            this.pos.y > this.bounds.top &&
            this.pos.y < this.bounds.bottom
        );
    }

    update(dt) {
        /* ---------- AIR PHYSICS ---------- */

        // Magnus effect
        this.vel.y += this.spin.side * this.magnus;
        this.vel.x -= this.spin.top * this.magnus * 0.4;

        // Drag
        this.vel.x *= this.airDrag;
        this.vel.y *= this.airDrag;

        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        /* ---------- VERTICAL PHYSICS ---------- */

        this.zVel -= this.gravity * dt;
        this.z += this.zVel;

        // Bounce ONLY if above table
        if (this.z <= 0 && this.isOverTable()) {
            this.z = 0;
            this.zVel = -this.zVel * this.bounceLoss;

            // Spin interaction with table
            this.vel.x += this.spin.top * 0.25;
            this.vel.y += this.spin.side * 0.3;

            this.spin.top *= this.spinFriction;
            this.spin.side *= this.spinFriction;

            if (Math.abs(this.zVel) < 1.2) this.zVel = 0;
        }

        // Ball falls off table → no more bounce
        if (!this.isOverTable() && this.z <= 0) {
            this.zVel = -8;
        }

        /* ---------- NET COLLISION ---------- */

        const crossingNet =
            Math.abs(this.pos.x - this.netX) < 2 &&
            this.z < this.netHeight;

        if (crossingNet) {
            // Soft tape roll
            this.vel.x *= -0.4;
            this.zVel = Math.max(this.zVel, 2);
            this.spin.top *= 0.5;
        }

        /* ---------- TABLE EDGES ---------- */

        if (this.pos.y < this.bounds.top || this.pos.y > this.bounds.bottom) {
            this.vel.y *= -0.9;
            this.spin.side *= -0.6;
        }
    }

    hitByPaddle(paddle) {
        const dx = Math.abs(this.pos.x - paddle.pos.x);
        const dy = this.pos.y - paddle.pos.y;

        if (
            dx < this.radius + paddle.width / 2 &&
            Math.abs(dy) < paddle.height / 2 &&
            this.z < 16
        ) {
            const dir = paddle.isAI ? -1 : 1;

            // Horizontal impulse
            this.vel.x = dir * (9 + Math.abs(paddle.swingSpeed) * 0.7);

            // Aim based on contact point
            this.vel.y += dy * 0.08;

            // Lift
            this.zVel = 6 + Math.abs(dy) * 0.05;

            // Spin from brushing
            this.spin.top += paddle.swingSpeed * 0.09;
            this.spin.side += dy * 0.01;
        }
    }

    draw(ctx) {
        /* ---------- SHADOW ---------- */

        // Shadow grows with height (correct)
        const shadowScale = Math.min(1.4, 0.6 + this.z / 25);

        ctx.globalAlpha = 0.35;
        ctx.drawImage(
            this.shadow,
            Math.round(this.pos.x - this.radius * shadowScale),
            Math.round(this.pos.y + 6),
            Math.round(this.radius * 2 * shadowScale),
            Math.round(this.radius * shadowScale)
        );
        ctx.globalAlpha = 1;

        /* ---------- BALL ---------- */

        ctx.drawImage(
            this.sprite,
            Math.round(this.pos.x - this.radius),
            Math.round(this.pos.y - this.radius - this.z),
            this.radius * 2,
            this.radius * 2
        );
    }
}
