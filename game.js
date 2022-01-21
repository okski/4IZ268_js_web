var canvas, canvasContext, raf, gShip, bulletInterval = 0;
var asteroids = [], bullets = [];
const events = {
    KeyD: false,
    KeyA: false,
    KeyW: false,
    Enter: false,
    Escape: false,
    Space: false
};

function generateBullet(x, y, angle) {
    return {
        x: x,
        y: y,
        vx: Math.sin(angle),
        vy: Math.cos(angle),
        width: 10,
        draw: function () {
            console.log(bulletInterval);

            canvasContext.fillRect(this.x - this.width/2, this.y - this.width/2, this.width, this.width);
        }
    }
}


function generateAsteroid() {
    let x, y, vx, vy;
    x = Math.floor(Math.random() * canvas.width + 1);
    y = Math.floor(Math.random() * canvas.height + 1);

    while (x >= canvas.width/2 - 50 && x <= canvas.width/2 + 50) {
        x = Math.floor(Math.random() * canvas.width + 1);
    }

    while (y >= canvas.height/2 - 25 && y <= canvas.height/2 + 25) {
        y = Math.floor(Math.random() * canvas.height + 1);
    }
    vx = Math.random() * 3;
    vy = Math.random() * 3;

    if (Math.random() <= 0.5) {
        vx *= -1;
    }

    if (Math.random() <= 0.5) {
        vy *= -1;
    }

    return {
        x: x,
        y: y,
        vx: vx,
        vy: vy,
        draw: function () {
            canvasContext.beginPath();
            canvasContext.moveTo(this.x, this.y);
            canvasContext.lineTo(this.x + 25, this.y - 25);
            canvasContext.lineTo(this.x + 50, this.y);
            canvasContext.lineTo(this.x + 25, this.y + 25);
            canvasContext.fill();
        }
    };
}


function initAsteroids() {
    let amount;
    amount = Math.floor(Math.random() * 10 + 3);

    for(let i = 0; i < amount; i++) {
        asteroids.push(generateAsteroid());
    }
}


function gameLoop() {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);

    bulletInterval++;

    moveShip();


    for (let bullet of bullets) {
        moveBullet(bullet);
    }

    for (let i = 0; i < asteroids.length; i++) {
        moveAsteroid(asteroids[i]);
    }
    raf = window.requestAnimationFrame(gameLoop);
}


function moveBullet(bullet) {
    // console.log(bullet);

    bullet.x += 5 * bullet.vx;
    bullet.y += 5 * bullet.vy * - 1;

    bullet.draw();
}


function moveAsteroid(asteroid) {
    asteroid.draw();

    asteroid.x += asteroid.vx;
    asteroid.y += asteroid.vy;

    if (asteroid.x > canvas.width) {
        asteroid.x = 0;
    }

    if (asteroid.x < 0) {
        asteroid.x = canvas.width;
    }

    if (asteroid.y > canvas.height) {
        asteroid.y = 0;
    }

    if (asteroid.y < 0) {
        asteroid.y = canvas.height;
    }
}


function generateShip() {
    return {
        x: canvas.width/2,
        y: canvas.height/2,
        angle: 0,
        angleRaw: 0,
        accelx: 0,
        accely: 0,
        // draw: function () {
        //     canvasContext.beginPath();
        //     canvasContext.moveTo(this.x, this.y);
        //     canvasContext.lineTo(this.x + 20, this.y);
        //     canvasContext.lineTo(this.x + 10, this.y - 20);
        //     canvasContext.fill();
        // },
        draw: function () {
            canvasContext.fillStyle = "#FF0000";
            canvasContext.fillRect(this.x -20/2, this.y -20/2, 20, 20);

            canvasContext.fillStyle = "#000000";
            let x1, y1, x2, y2, x3, y3, x1r, y1r, x2r, y2r, x3r, y3r;
            this.angle = this.angleRaw*(Math.PI/180);
            x1 = this.x;
            y1 = this.y - 20 / 2;
            x2 = this.x + 20 / 2;
            y2 = this.y + 20 / 2;
            x3 = this.x - 20 / 2;
            y3 = y2;

            x1r = ((x1 - this.x) * Math.cos(this.angle) - (y1 - this.y) * Math.sin(this.angle) + this.x);
            y1r = ((x1 - this.x) * Math.sin(this.angle) + (y1 - this.y) * Math.cos(this.angle) + this.y);

            x2r = ((x2 - this.x) * Math.cos(this.angle) - (y2 - this.y) * Math.sin(this.angle) + this.x);
            y2r = ((x2 - this.x) * Math.sin(this.angle) + (y2 - this.y) * Math.cos(this.angle) + this.y);

            x3r = ((x3 - this.x) * Math.cos(this.angle) - (y3 - this.y) * Math.sin(this.angle) + this.x);
            y3r = ((x3 - this.x) * Math.sin(this.angle) + (y3 - this.y) * Math.cos(this.angle) + this.y);

            // console.log(x1r, y1r, x2r, y2r, x3r, y3r);

            canvasContext.beginPath();
            canvasContext.moveTo(x1r, y1r);
            canvasContext.lineTo(x2r, y2r);
            canvasContext.lineTo(x3r, y3r);
            canvasContext.lineTo(x1r, y1r);
            canvasContext.fill();

        },
        turnRight: function () {
            this.angleRaw += 5;
        },
        turnLeft: function () {
            this.angleRaw -= 5;
        },
        moveForward: function () {
            this.accelx = 2 * Math.sin(this.angle);
            this.accely = 2 * Math.cos(this.angle);
        },
        applyAccel: function () {
            this.x += this.accelx;
            this.y -= this.accely;

            this.accelx *= 0.95;
            this.accely *= 0.95;
        },
        shoot: function () {
            if (bulletInterval > 20) {
                let bullet = generateBullet(this.x, this.y, this.angle);
                bullets.push(bullet);
                bulletInterval = 0;
            }
        }
    }
}


function moveShip() {
    const shipMovement = {
        KeyD: "turnRight",
        KeyA: "turnLeft",
        KeyW: "moveForward",
        Space: "shoot"
    };
    for (let i in shipMovement) {
        if (events[i]) {
            gShip[shipMovement[i]]();
        }
    }

    gShip.applyAccel();

    gShip.draw();
}








$(document).ready( function () {
    canvas = document.getElementById('game');
    canvasContext = canvas.getContext('2d');

    initAsteroids();
    gShip = generateShip();

    window.addEventListener("keydown", function (event) {

        if (!(event.code in events)) {
            event.preventDefault();
        }

        console.log(event);

        if (event.code in events) {
            event.preventDefault();
            events[event.code] = true;
        }
    })

    window.addEventListener("keyup", function (event) {
        if (event.code in events) {
            event.preventDefault();
            events[event.code] = false;
        }
    })

    gameLoop();

});