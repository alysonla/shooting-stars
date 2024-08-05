const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0;
let player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    width: 50,
    height: 50,
    speed: 10,
    dx: 0
};

let stars = [];

function drawPlayer() {
    // Stickman parameters
    const headRadius = 10;
    const headX = player.x + player.width / 2;
    const headY = player.y + headRadius;
    const bodyLength = 30;
    const armLength = 15;
    const legLength = 20;

    // Draw head
    context.beginPath();
    context.arc(headX, headY, headRadius, 0, Math.PI * 2);
    context.fillStyle = 'black';
    context.fill();
    context.closePath();

    // Draw body
    context.beginPath();
    context.moveTo(headX, headY + headRadius);
    context.lineTo(headX, headY + headRadius + bodyLength);
    context.strokeStyle = 'black';
    context.lineWidth = 2;
    context.stroke();
    context.closePath();

    // Draw arms
    context.beginPath();
    context.moveTo(headX, headY + headRadius + 10);
    context.lineTo(headX - armLength, headY + headRadius + 20);
    context.moveTo(headX, headY + headRadius + 10);
    context.lineTo(headX + armLength, headY + headRadius + 20);
    context.strokeStyle = 'black';
    context.lineWidth = 2;
    context.stroke();
    context.closePath();

    // Draw legs
    context.beginPath();
    context.moveTo(headX, headY + headRadius + bodyLength);
    context.lineTo(headX - legLength, headY + headRadius + bodyLength + legLength);
    context.moveTo(headX, headY + headRadius + bodyLength);
    context.lineTo(headX + legLength, headY + headRadius + bodyLength + legLength);
    context.strokeStyle = 'black';
    context.lineWidth = 2;
    context.stroke();
    context.closePath();
}

function drawStar(star) {
    context.beginPath();
    context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    context.fillStyle = 'yellow';
    context.fill();
    context.closePath();
    
    // Draw the trail
    for (let i = 0; i < star.trail.length; i++) {
        context.beginPath();
        context.arc(star.trail[i].x, star.trail[i].y, star.radius - i * 0.5, 0, Math.PI * 2);
        context.fillStyle = `rgba(255, 255, 0, ${1 - i * 0.1})`;
        context.fill();
        context.closePath();
    }
}

function clear() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function newStar() {
    let x = Math.random() * canvas.width;
    let radius = 10;
    let y = -radius;
    let dy = 3;
    stars.push({ x, y, radius, dy, trail: [] });
}

function updateStars() {
    for (let i = 0; i < stars.length; i++) {
        stars[i].trail.push({ x: stars[i].x, y: stars[i].y });
        if (stars[i].trail.length > 10) {
            stars[i].trail.shift();
        }
        
        stars[i].y += stars[i].dy;

        if (stars[i].y + stars[i].radius > player.y &&
            stars[i].y - stars[i].radius < player.y + player.height &&
            stars[i].x + stars[i].radius > player.x &&
            stars[i].x - stars[i].radius < player.x + player.width) {
            stars.splice(i, 1);
            score++;
            document.getElementById('score').innerText = `Score: ${score}`;
        } else if (stars[i].y - stars[i].radius > canvas.height) {
            stars.splice(i, 1);
        }
    }
}

function movePlayer() {
    player.x += player.dx;

    if (player.x < 0) {
        player.x = 0;
    } else if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }
}

function update() {
    clear();
    drawPlayer();
    stars.forEach(drawStar);
    updateStars();
    movePlayer();
    requestAnimationFrame(update);
}

function keyDown(e) {
    if (e.key === 'ArrowRight' || e.key === 'Right') {
        player.dx = player.speed;
    } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        player.dx = -player.speed;
    }
}

function keyUp(e) {
    if (e.key === 'ArrowRight' || e.key === 'Right' ||
        e.key === 'ArrowLeft' || e.key === 'Left') {
        player.dx = 0;
    }
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

setInterval(newStar, 1000);
update();

