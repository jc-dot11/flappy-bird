// script.js

const canvas = document.getElementById('flappy-bird');
const ctx = canvas.getContext('2d');

const bird = {
    x: 50,
    y: canvas.height / 2,
    width: 20,
    height: 20,
    gravity: 0.6,
    lift: -15,
    velocity: 0
};

const pipes = [];
const pipeWidth = 40;
const pipeGap = 120;
const pipeSpeed = 2;

let score = 0;
let gameOver = false;

function drawBird() {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height > canvas.height) {
        bird.y = canvas.height - bird.height;
        bird.velocity = 0;
    }
    if (bird.y < 0) {
        bird.y = 0;
        bird.velocity = 0;
    }
}

function drawPipes() {
    pipes.forEach(pipe => {
        ctx.fillStyle = 'green';
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        ctx.fillRect(pipe.x, pipe.top + pipeGap, pipeWidth, canvas.height - pipe.top - pipeGap);
    });
}

function updatePipes() {
    pipes.forEach(pipe => {
        pipe.x -= pipeSpeed;
    });

    if (pipes[0] && pipes[0].x + pipeWidth < 0) {
        pipes.shift();
        score++;
    }

    if (pipes[pipes.length - 1] && pipes[pipes.length - 1].x < canvas.width - 200) {
        const pipeHeight = Math.random() * (canvas.height - pipeGap);
        pipes.push({
            x: canvas.width,
            top: pipeHeight
        });
    }
}

function checkCollisions() {
    pipes.forEach(pipe => {
        if (bird.x + bird.width > pipe.x && bird.x < pipe.x + pipeWidth) {
            if (bird.y < pipe.top || bird.y + bird.height > pipe.top + pipeGap) {
                gameOver = true;
            }
        }
    });

    if (bird.y + bird.height >= canvas.height || bird.y <= 0) {
        gameOver = true;
    }
}

function handleInput() {
    document.addEventListener('keydown', () => {
        if (!gameOver) {
            bird.velocity = bird.lift;
        }
    });
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
}

function drawGameOver() {
    ctx.fillStyle = 'black';
    ctx.font = '30px Arial';
    ctx.fillText('Game Over!', canvas.width / 2 - 85, canvas.height / 2);
    ctx.font = '20px Arial';
    ctx.fillText('Press F5 to restart', canvas.width / 2 - 80, canvas.height / 2 + 40);
}

function update() {
    if (gameOver) {
        drawGameOver();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBird();
    updateBird();
    drawPipes();
    updatePipes();
    checkCollisions();
    drawScore();

    requestAnimationFrame(update);
}

handleInput();
update();
