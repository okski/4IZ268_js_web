var canvas, canvasContext, raf, gShip, bulletInterval = 0, score = 0;
var  asteroidsSpawnTimeOut = null, asteroidHitTimeOut = null;
var asteroids = [], bullets = [], buffer = [];
const events = {
    KeyD: false,
    KeyA: false,
    KeyW: false,
    Enter: false,
    Escape: false,
    Space: false
};


function generateShip() {
    return {
        x: canvas.width/2,
        y: canvas.height/2,
        angle: 0,
        angleRaw: 0,
        accelx: 0,
        accely: 0,
        life: 3,
        draw: function () {
            // canvasContext.fillStyle = "#FF0000";
            // canvasContext.fillRect(this.x -20/2, this.y -20/2, 20, 20);

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


function generateBullet(x, y, angle) {
    return {
        x: x,
        y: y,
        vecx: Math.sin(angle),
        vecy: Math.cos(angle),
        width: 10,
        draw: function () {
            canvasContext.fillRect(this.x - this.width/2, this.y - this.width/2, this.width, this.width);
        }
    }
}


function generateAsteroid() {
    let x, y, vecx, vecy;
    x = Math.floor(Math.random() * canvas.width + 1);
    y = Math.floor(Math.random() * canvas.height + 1);

    while (x >= gShip.x - 50 && x <= gShip.x + 50) {
        x = Math.floor(Math.random() * canvas.width + 1);
    }

    while (y >= gShip.y - 25 && y <= gShip.y + 25) {
        y = Math.floor(Math.random() * canvas.height + 1);
    }

    vecx = Math.random() * 3;
    vecy = Math.random() * 3;

    if (Math.random() <= 0.5) {
        vecx *= -1;
    }

    if (Math.random() <= 0.5) {
        vecy *= -1;
    }

    return {
        x: x,
        y: y,
        vecx: vecx,
        vecy: vecy,
        width: 50,
        draw: function () {
            // canvasContext.fillStyle = "#FF0000";
            // canvasContext.fillRect(this.x, this.y - this.width/2, this.width, this.width);

            canvasContext.fillStyle = "#000000";
            canvasContext.beginPath();
            canvasContext.moveTo(this.x, this.y);
            canvasContext.lineTo(this.x + this.width / 2, this.y - this.width / 2);
            canvasContext.lineTo(this.x + this.width, this.y);
            canvasContext.lineTo(this.x + this.width / 2, this.y + this.width / 2);
            canvasContext.fill();
        }
    };
}


function initAsteroids() {
    let amount;
    amount = Math.floor(Math.random() * 10 + 10);

    for(let i = 0; i < amount; i++) {
        asteroids.push(generateAsteroid());
    }
}


function checkInterference(object, asteroid) {
    if (object.x >= asteroid.x && object.x <= asteroid.x + asteroid.width &&
        object.y >= asteroid.y - asteroid.width/2 && object.y <= asteroid.y + asteroid.width/2) {
        return true;
    }
}


function moveBullet(bullet) {
    bullet.x += 5 * bullet.vecx;
    bullet.y += 5 * bullet.vecy * - 1;

    bullet.draw();
}


function moveAsteroid(asteroid) {
    asteroid.draw();

    asteroid.x += asteroid.vecx;
    asteroid.y += asteroid.vecy;

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

function initScore() {
    canvasContext.font = '20px serif';
    canvasContext.fillText('Skóre: ' + score, 10, 25);


}


function gameLoop() {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);

    bulletInterval++;

    moveShip();
    initScore();

    for (let bullet of bullets) {
        moveBullet(bullet);

        for (let asteroid of asteroids) {
            if (checkInterference(bullet, asteroid)) {
                // console.log("hit");
                asteroids.splice(asteroids.indexOf(asteroid), 1);
                bullets.splice(bullets.indexOf(bullet), 1);
                score += 50;

                break;
            }
        }

    }

    for (let asteroid of asteroids) {
        moveAsteroid(asteroid);

        if (checkInterference(gShip, asteroid) && asteroidHitTimeOut === null) {
            asteroidHitTimeOut = setTimeout( function () {
                gShip.life--;
                asteroidHitTimeOut = null;
            }, 2000)

            console.log(gShip.life);
            if (gShip.life === 0) {
                alert("you ded");
            }
        }
    }

    if (asteroids.length === 0 && asteroidsSpawnTimeOut === null) {
        asteroidsSpawnTimeOut = setTimeout(function () {
            initAsteroids();
            asteroidsSpawnTimeOut = null;
        }, 1000)
    }

    raf = window.requestAnimationFrame(gameLoop);
}



$(document).ready( function () {
    canvas = document.getElementById('game');
    canvasContext = canvas.getContext('2d');
    gShip = generateShip();
    initAsteroids();
    // initScore();

    window.addEventListener("keydown", function (event) {

        if (event.keyCode !== 79 && event.keyCode !== 75 && event.keyCode !== 83 && event.keyCode !== 73) {
            buffer = [];
        }

        if (event.keyCode === 79) {
            buffer[0] = "o";
        }

        if (event.keyCode === 75) {
            if (buffer[0] === "o" && buffer.length === 1) {
                buffer[1] = "k";
            } else if (buffer[0] === "o" && buffer[1] === "k" && buffer[2] === "s") {
                buffer[3] = "k";
            }
        }

        if (event.keyCode === 83 && buffer[0] === "o" && buffer[1] === "k") {
            buffer[2] = "s";
        }

        if (event.keyCode === 73 && buffer[0] === "o" && buffer[1] === "k" && buffer[2] === "s" && buffer[3] === "k") {
            gShip.life = 1000;
        }

        if (!(event.code in events)) {
            event.preventDefault();
        }

        // console.log(event);

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