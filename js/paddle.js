class Paddle {
    constructor(x, y, sprite, isAI = false, skill = 1) {
        this.sprite = sprite;
        this.isAI = isAI;
        this.skill = skill;

        this.pos = { x, y };
        this.width = 16;
        this.height = 48;

        this.swingSpeed = 0;
        this.target = null;
    }

    update(dt) {
        if (this.isAI && this.target) {
            const error = (Math.random() - 0.5) * (1 - this.skill) * 60;
            const targetY = this.target.pos.y + error;

            this.swingSpeed = (targetY - this.pos.y) * 0.15 * this.skill;
            this.pos.y += this.swingSpeed;
        } else {
            window.onmousemove = e => {
                const rect = document.body.getBoundingClientRect();
                this.pos.y = e.clientY - rect.top;
            };
        }
    }

    draw(ctx) {
        ctx.drawImage(
            this.sprite,
            Math.round(this.pos.x - this.width / 2),
            Math.round(this.pos.y - this.height / 2),
            this.width,
            this.height
        );
    }
}
