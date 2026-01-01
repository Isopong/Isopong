class Paddle {
    constructor(x, isAI = false) {
        this.x = x;
        this.y = 270;
        this.width = 16;
        this.height = 96;
        this.speed = 400;
        this.dy = 0;
        this.isAI = isAI;

        this.image = new Image();
        this.image.src = "assets/sprites/paddle.png";
    }

    update(dt, ball, inputUp = false, inputDown = false) {
        this.dy = 0;

        if (this.isAI) {
            // Simple AI: move toward ball's Y position
            let diff = ball.y - this.y;
            let maxSpeed = 300; // pixels/sec
            this.dy = Math.max(Math.min(diff * 5 * dt, maxSpeed), -maxSpeed);
        } else {
            if (inputUp) this.dy = -this.speed;
            if (inputDown) this.dy = this.speed;
        }

        this.y += this.dy * dt;

        // Clamp inside table (assumes table height 200, y offset 170)
        const top = 80 + this.height / 2;
        const bottom = 460 - this.height / 2;
        this.y = Math.max(top, Math.min(bottom, this.y));
    }

    draw(ctx) {
        if (!this.image.complete) return;
        ctx.drawImage(
            this.image,
            this.x - this.width / 2,
            this.y - this.height / 2,
            this.width,
            this.height
        );
    }
}
