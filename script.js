const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 1200;
canvas.height = 550;

const segmentSize = 20; // New size for snake segments

let snake = [{ x: 300, y: 300 }];
let direction = { x: 0, y: 0 };
let food = { x: 0, y: 0 };
let score = 0;
let gameRunning = false;
let speed = 200;
let gameLoop;
let bgColor1 = '#121212';
let bgColor2 = '#1f1f1f';
let bgColor3 = '#282828';
let bgColor4 = '#323232';
let bgColor5 = '#3d3d3d';

const scoreDisplay = document.getElementById('score');
const startBtn = document.getElementById('startBtn');

startBtn.addEventListener('click', startGame);

function startGame() {
    snake = [{ x: 300, y: 300 }];
    direction = { x: 0, y: 0 };
    score = 0;
    speed = 200;
    gameRunning = true;
    updateScore();
    placeFood();
    clearInterval(gameLoop);
    gameLoop = setInterval(updateGame, speed);
}

function updateGame() {
    if (!gameRunning) return;

    updateSnake();
    if (checkCollision()) {
        gameOver();
        return;
    }

    if (checkFoodCollision()) {
        score++;
        updateScore();
        placeFood();
        increaseSpeed();
    }

    clearCanvas();
    drawFood();
    drawSnake();
}

function updateSnake() {
    const head = { x: snake[0].x + direction.x * segmentSize, y: snake[0].y + direction.y * segmentSize };
    snake.unshift(head);
    if (!(head.x === food.x && head.y === food.y)) {
        snake.pop();
    }
}

function changeDirection(event) {
    const keyPressed = event.keyCode;
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;

    if (keyPressed === LEFT && direction.x !== 1) {
        direction = { x: -1, y: 0 };
    } else if (keyPressed === UP && direction.y !== 1) {
        direction = { x: 0, y: -1 };
    } else if (keyPressed === RIGHT && direction.x !== -1) {
        direction = { x: 1, y: 0 };
    } else if (keyPressed === DOWN && direction.y !== -1) {
        direction = { x: 0, y: 1 };
    }
}

function checkCollision() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x >= canvas.width;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y >= canvas.height;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

function checkFoodCollision() {
    return snake[0].x === food.x && snake[0].y === food.y;
}

function placeFood() {
    food.x = Math.floor(Math.random() * canvas.width / segmentSize) * segmentSize;
    food.y = Math.floor(Math.random() * canvas.height / segmentSize) * segmentSize;

    // Ensure food does not appear on the snake
    snake.forEach(part => {
        if (part.x === food.x && part.y === food.y) {
            placeFood();
        }
    });
}

function increaseSpeed() {
    clearInterval(gameLoop);
    speed = Math.max(50, speed - 10); // Increase speed more smoothly
    gameLoop = setInterval(updateGame, speed);
}

function clearCanvas() {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, bgColor1);
    gradient.addColorStop(0.25, bgColor2);
    gradient.addColorStop(0.5, bgColor3);
    gradient.addColorStop(0.75, bgColor4);
    gradient.addColorStop(1, bgColor5);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    ctx.fillStyle = 'green'; // Snake color
    snake.forEach((part, index) => {
        ctx.fillRect(part.x, part.y, segmentSize, segmentSize);
        if (index === 0) {
            drawFace(part);
        } else if (index === snake.length - 1) {
            drawTail(part);
        }
    });
}

function drawFood() {
    ctx.fillStyle = 'red'; // Food color
    ctx.fillRect(food.x, food.y, segmentSize, segmentSize);
}

function drawFace(part) {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(part.x + segmentSize / 2, part.y + segmentSize / 2, segmentSize / 2, 0, Math.PI * 2, true); // Face
    ctx.fill();
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(part.x + segmentSize / 2 - 3, part.y + segmentSize / 2 - 3, 2, 0, Math.PI * 2, true); // Left eye
    ctx.fill();
    ctx.beginPath();
    ctx.arc(part.x + segmentSize / 2 + 3, part.y + segmentSize / 2 - 3, 2, 0, Math.PI * 2, true); // Right eye
    ctx.fill();
}

function drawTail(part) {
    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.moveTo(part.x + segmentSize / 2, part.y);
    ctx.lineTo(part.x, part.y + segmentSize);
    ctx.lineTo(part.x + segmentSize, part.y + segmentSize);
    ctx.closePath();
    ctx.fill();
}

function gameOver() {
    gameRunning = false;
    alert('Game Over! Your score was ' + score);
}

function updateScore() {
    scoreDisplay.innerText = 'Score: ' + score;
}

window.addEventListener('keydown', changeDirection);

// Touch controls for mobile devices
canvas.addEventListener('touchstart', handleTouchStart);
canvas.addEventListener('touchmove', handleTouchMove);

let xDown = null;
let yDown = null;

function handleTouchStart(evt) {
    const firstTouch = evt.touches[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
}

function handleTouchMove(evt) {
    if (!xDown || !yDown) {
        return;
    }

    const xUp = evt.touches[0].clientX;
    const yUp = evt.touches[0].clientY;

    const xDiff = xDown - xUp;
    const yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0 && direction.x !== 1) {
            direction = { x: -1, y: 0 };
        } else if (xDiff < 0 && direction.x !== -1) {
            direction = { x: 1, y: 0 };
        }
    } else {
        if (yDiff > 0 && direction.y !== 1) {
            direction = { x: 0, y: -1 };
        } else if (yDiff < 0 && direction.y !== -1) {
            direction = { x: 0, y: 1 };
        }
    }

    xDown = null;
    yDown = null;
}
