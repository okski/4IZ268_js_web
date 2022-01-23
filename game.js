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

const allowedKeys = {
    q: "q", w: "w", e: "e", r: "r", t: "t", z: "z", u: "u", i: "i", o: "o", p: "p",
    a: "a", s: "s", d: "d", f: "f", g: "g", h: "h", j: "j", k: "k", l: "l",
    y: "y", x: "x", c: "c", v: "v", b: "b", n: "n", m: "m",
    Q: "Q", W: "W", E: "E", R: "R", T: "T", Z: "Z", U: "U", I: "I", O: "O", P: "P",
    A: "A", S: "S", D: "D", F: "F", G: "G", H: "H", J: "J", K: "K", L: "L",
    Y: "Y", X: "X", C: "C", V: "V", B: "B", N: "N", M: "M",
    0: "0", 1: "1", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6", 7: "7", 8: "8", 9: "9"
}
var leaderboard, nickname, nicknameInput, gameReset, gameResetButton, gameEndButton;


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

    // console.log(leaderboard);

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

                // https://akce.cu.ma/getJSON.php
                // leaderboard.json

                $.ajax({
                    url: "https://akce.cu.ma/getJSON.php",
                    type: "GET",
                    crossDomain: true,
                    dataType: "json",
                    success: function (json) {
                        leaderboard = json;
                        console.log(json);
                        if (leaderboard.scoreboard[leaderboard.scoreboard.length - 1].score >= score) {
                            // console.log(leaderboard);
                            gameRestart();
                            return;
                        }
                        nickname.style.visibility = "visible";
                        nicknameInput.focus();
                    }
                });

                // alert("you ded");
            }
        }
    }

    if (asteroids.length === 0 && asteroidsSpawnTimeOut === null) {
        asteroidsSpawnTimeOut = setTimeout(function () {
            initAsteroids();
            asteroidsSpawnTimeOut = null;
        }, 1000)
    }

    if (gShip.life >= 0) {
        raf = window.requestAnimationFrame(gameLoop);
    }
}

function checkKeyForNickName(event) {
    console.log(event);

    if (event.key === "Enter") {
        changeJSON();
        return;
    }

    if (!(event.key in allowedKeys) && !(event.code === 'Backspace') && !(event.code === 'Delete')) {
        event.preventDefault();
        // console.log(event.code);
        // console.log(event.which);
    }

}


//TODO nickame grab
function changeJSON() {

    for (let i = 8; i >= 0; i--) {
        if (leaderboard.scoreboard[i].score >= score) {
            leaderboard.scoreboard[i + 1].score = score;
            leaderboard.scoreboard[i + 1].nickname = nicknameInput.value;
            console.log(nicknameInput.value);
            break;
        } else {
            leaderboard.scoreboard[i + 1].score = leaderboard.scoreboard[i].score;
            leaderboard.scoreboard[i + 1].nickname = leaderboard.scoreboard[i].nickname;
        }
    }

    if (leaderboard.scoreboard[0].score < score) {
        leaderboard.scoreboard[0].score = score;
        console.log(nicknameInput.value);
        leaderboard.scoreboard[0].nickname = nicknameInput.value;
    }

    saveJSON();
}

function saveJSON() {
    $.ajax({
        url: "https://akce.cu.ma/saveJSON.php",
        type: "POST",
        dataType: "json",
        data: JSON.stringify(leaderboard),
        success: function (res) {
            // console.log(res);
            // alert("done successfully")
        }
        // error: function (XMLHttpRequest, textStatus, errorThrown) {
        //     console.log(XMLHttpRequest, textStatus, errorThrown);
        // }
    });

    gameRestart();
}

function gameRestart(){
    nickname.style.visibility = "hidden";
    gameReset.style.visibility = "visible";

    gameResetButton.focus();

    gameEndButton.onclick = function () {
        location.href='menu.html';
    };

    gameResetButton.onclick = function () {
        gameReset.style.visibility = "hidden";
        gShip = generateShip();
        initAsteroids();
        score = 0;
        gameLoop();
    }
}


$(document).ready( function () {
    canvas = document.getElementById('game');
    canvasContext = canvas.getContext('2d');
    gShip = generateShip();
    initAsteroids();

    nickname = document.getElementById("nickname");
    nicknameInput = document.getElementById("nicknameInput");
    gameReset = document.getElementById("gameReset");
    gameResetButton = document.getElementById("resetButton");
    gameEndButton = document.getElementById("endButton");


    nicknameInput.addEventListener("keypress", function (event) {
        checkKeyForNickName(event, nicknameInput);
    });
    nicknameInput.addEventListener("keydown", function (event) {
        if (event.ctrlKey && event.code === "KeyV") {
            event.preventDefault();
            console.log(event);
        }
    });

    window.addEventListener("keydown", function (event) {

        if (event.which !== 79 && event.which !== 75 && event.which !== 83 && event.which !== 73) {
            buffer = [];
        }

        if (event.which === 79) {
            buffer[0] = "o";
        }

        if (event.which === 75) {
            if (buffer[0] === "o" && buffer.length === 1) {
                buffer[1] = "k";
            } else if (buffer[0] === "o" && buffer[1] === "k" && buffer[2] === "s") {
                buffer[3] = "k";
            }
        }

        if (event.which === 83 && buffer[0] === "o" && buffer[1] === "k") {
            buffer[2] = "s";
        }

        if (event.which === 73 && buffer[0] === "o" && buffer[1] === "k" && buffer[2] === "s" && buffer[3] === "k") {
            gShip.life = 1000;
        }


        if (event.code === "Space") {
            event.preventDefault();
        }

        if (event.code in events) {
            // event.preventDefault();
            events[event.code] = true;
        }
    })

    window.addEventListener("keyup", function (event) {
        if (event.code in events) {
            // event.preventDefault();
            events[event.code] = false;
        }
    })

    gameLoop();
});