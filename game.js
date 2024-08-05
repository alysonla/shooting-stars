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
    context.fillStyle = 'blue';
    context.fillRect(player.x, player.y, player.width, player.height);
}

function drawStar(star) {
    context.beginPath();
    context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    context.fillStyle = 'yellow';
    context.fill();
    context.closePath();
}

function clear() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function newStar() {
    let x = Math.random() * canvas.width;
    let radius = 10;
    let y = -radius;
    let dy = 3;
    stars.push({ x, y, radius, dy });
}

function updateStars() {
    for (let i = 0; i < stars.length; i++) {
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
