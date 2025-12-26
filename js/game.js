class Game {
    constructor(ctx){
        this.ctx = ctx;
        this.tableImg = new Image();
        this.tableImg.src = 'assets/sprites/table.png';

        this.ballImg = new Image();
        this.ballImg.src = 'assets/sprites/ball.png';

        this.shadowImg = new Image();
        this.shadowImg.src = 'assets/sprites/shadow.png';

        this.paddleImg = new Image();
        this.paddleImg.src = 'assets/sprites/paddle.png';

        this.ball = null;
        this.player = null;
        this.ai = null;
        this.camera = null;

        this.lastTime = 0;
        this.score = {player:0, ai:0};
    }

    init(canvas){
        // Table bounds (example)
        window.tableBounds = {xMin:50,xMax:750,yMin:50,yMax:550};

        // Create ball
        this.ball = new Ball(400,300,this.ballImg,this.shadowImg,tableBounds);

        // Create paddles
        this.player = new Paddle(400,520,this.paddleImg,false,0.8);
        this.ai = new Paddle(400,80,this.paddleImg,true,0.7);
        this.ai.target = this.ball;

        // Camera
        this.camera = new Camera(canvas);
        this.camera.target = this.ball;
    }

    update(dt){
        this.ball.update(dt);
        this.player.update(dt);
        this.ai.update(dt);

        // Ball collisions
        this.ball.hitByPaddle(this.player);
        this.ball.hitByPaddle(this.ai);

        this.camera.update();

        // Check scoring
        if(this.ball.pos.y < tableBounds.yMin) { this.score.player++; this.ballReset(); }
        if(this.ball.pos.y > tableBounds.yMax) { this.score.ai++; this.ballReset(); }
    }

    ballReset(){
        this.ball.pos = {x:400,y:300};
        this.ball.z = 0;
        this.ball.vel = {x:(Math.random()-0.5)*8,y:(Math.random()-0.5)*8};
        this.ball.zVel = 0;
        this.ball.spin = {x:0,y:0};
    }

    draw(){
        const ctx = this.ctx;
        ctx.save();
        this.camera.apply(ctx);

        // Draw table
        ctx.drawImage(this.tableImg, tableBounds.xMin, tableBounds.yMin, tableBounds.xMax-tableBounds.xMin, tableBounds.yMax-tableBounds.yMin);

        // Draw paddles
        this.player.draw(ctx);
        this.ai.draw(ctx);

        // Draw ball
        this.ball.draw(ctx);

        ctx.restore();

        // Draw score
        ctx.fillStyle = "white";
        ctx.font = "24px sans-serif";
        ctx.fillText(`Player: ${this.score.player}`,20,30);
        ctx.fillText(`AI: ${this.score.ai}`,650,30);
    }
}
