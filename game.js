// game.js
// Contains the main game logic for a simple Pong game
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 14;
const PLAYER_X = 20;
const AI_X = canvas.width - PADDLE_WIDTH - 20;
const PADDLE_SPEED = 6;
const AI_SPEED = 4;
const BALL_SPEED = 6;

// Game state
let playerY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let aiY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let ballX = canvas.width / 2 - BALL_SIZE / 2;
let ballY = canvas.height / 2 - BALL_SIZE / 2;
let ballVelX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
let ballVelY = BALL_SPEED * (Math.random() * 2 - 1);

function drawRect(x, y, w, h, color = '#fff') {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color = '#fff') {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
}

// Draw midline
function drawNet() {
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 4;
    for (let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, y);
        ctx.lineTo(canvas.width / 2, y + 16);
        ctx.stroke();
    }
}

function resetBall() {
    ballX = canvas.width / 2 - BALL_SIZE / 2;
    ballY = canvas.height / 2 - BALL_SIZE / 2;
    // Randomize direction
    ballVelX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
    ballVelY = BALL_SPEED * (Math.random() * 2 - 1);
}

function moveAI() {
    let aiCenter = aiY + PADDLE_HEIGHT / 2;
    if (aiCenter < ballY) {
        aiY += AI_SPEED;
    } else if (aiCenter > ballY) {
        aiY -= AI_SPEED;
    }
    // Clamp position
    aiY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, aiY));
}

// Mouse movement for player paddle
canvas.addEventListener('mousemove', (e) => {
    let rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;
    // Clamp
    playerY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, playerY));
});

function update() {
    // Move ball
    ballX += ballVelX;
    ballY += ballVelY;

    // Top and bottom wall collision
    if (ballY < 0) {
        ballY = 0;
        ballVelY *= -1;
    }
    if (ballY + BALL_SIZE > canvas.height) {
        ballY = canvas.height - BALL_SIZE;
        ballVelY *= -1;
    }

    // Paddle collision (player)
    if (
        ballX < PLAYER_X + PADDLE_WIDTH &&
        ballX + BALL_SIZE > PLAYER_X &&
        ballY + BALL_SIZE > playerY &&
        ballY < playerY + PADDLE_HEIGHT
    ) {
        ballX = PLAYER_X + PADDLE_WIDTH;
        ballVelX *= -1;
        // Add some "english"
        let hitPoint = (ballY + BALL_SIZE/2) - (playerY + PADDLE_HEIGHT/2);
        ballVelY = hitPoint * 0.25;
    }

    // Paddle collision (AI)
    if (
        ballX + BALL_SIZE > AI_X &&
        ballX < AI_X + PADDLE_WIDTH &&
        ballY + BALL_SIZE > aiY &&
        ballY < aiY + PADDLE_HEIGHT
    ) {
        ballX = AI_X - BALL_SIZE;
        ballVelX *= -1;
        let hitPoint = (ballY + BALL_SIZE/2) - (aiY + PADDLE_HEIGHT/2);
        ballVelY = hitPoint * 0.25;
    }

    // Score (ball goes out of bounds)
    if (ballX < 0 || ballX > canvas.width) {
        resetBall();
    }

    moveAI();
}

function render() {
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Net
    drawNet();

    // Player paddle
    drawRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // AI paddle
    drawRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Ball
    drawCircle(ballX + BALL_SIZE / 2, ballY + BALL_SIZE / 2, BALL_SIZE / 2);
}

function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

gameLoop();