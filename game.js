var canvas, canvasContext, raf, gShip, bulletInterval = 0, score = 0;
var  asteroidsSpawnTimeOut = null, asteroidHitTimeOut = null;
var asteroids = [], bullets = [], buffer = [];
var leaderboard, nickname, nicknameInput, gameReset, gameResetButton, gameEndButton, escapeDiv, escapeResumeButton,
    escapeResetButton, escapeEndButton;

const events = {
    KeyD: false,
    KeyA: false,
    KeyW: false,
    Enter: false,
    Space: false
};

const escapeEvent = {
    Escape: false
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

/**
 *  This function sets valid rotation degree if someone tempered with it. 
 */
function setValidDegree() {
    if (localStorage.getItem("rotationDegree") > 90 || localStorage.getItem("rotationDegree") < -90) {
        localStorage.setItem("rotationDegree", Number("5"));
    }

    if (sessionStorage.getItem("rotationDegree") > 90 || sessionStorage.getItem("rotationDegree") < -90) {
        sessionStorage.setItem("rotationDegree", Number("5"));
    }
}

/**
 *  This function generates instance of ship.
 *  @returns {{moveForward: moveForward, turnRight: turnRight, draw: draw, life: number, angleRaw: number, accely: number,
 *  accelx: number, x: number, turnLeft: turnLeft, y: number, angle: number, shoot: shoot, applyAccel: applyAccel}}
 *  instance of ship
 */
function generateShip() {
    return {
        x: canvas.width/2,
        y: canvas.height/2,
        angle: 0,
        angleRaw: 0,
        accelx: 0,
        accely: 0,
        width: 20,
        life: 3,
        draw: function () {
            // canvasContext.fillStyle = "#FF0000";
            // canvasContext.fillRect(this.x -this.width/2, this.y -this.width/2, this.width, this.width);

            canvasContext.fillStyle = "#000000";
            let x1, y1, x2, y2, x3, y3, x1r, y1r, x2r, y2r, x3r, y3r;
            this.angle = this.angleRaw*(Math.PI/180);
            x1 = this.x;
            y1 = this.y - this.width / 2;
            x2 = this.x + this.width / 2;
            y2 = this.y + this.width / 2;
            x3 = this.x - this.width / 2;
            y3 = y2;

            x1r = ((x1 - this.x) * Math.cos(this.angle) - (y1 - this.y) * Math.sin(this.angle) + this.x);
            y1r = ((x1 - this.x) * Math.sin(this.angle) + (y1 - this.y) * Math.cos(this.angle) + this.y);

            x2r = ((x2 - this.x) * Math.cos(this.angle) - (y2 - this.y) * Math.sin(this.angle) + this.x);
            y2r = ((x2 - this.x) * Math.sin(this.angle) + (y2 - this.y) * Math.cos(this.angle) + this.y);

            x3r = ((x3 - this.x) * Math.cos(this.angle) - (y3 - this.y) * Math.sin(this.angle) + this.x);
            y3r = ((x3 - this.x) * Math.sin(this.angle) + (y3 - this.y) * Math.cos(this.angle) + this.y);


            canvasContext.beginPath();
            canvasContext.moveTo(x1r, y1r);
            canvasContext.lineTo(x2r, y2r);
            canvasContext.lineTo(x3r, y3r);
            canvasContext.lineTo(x1r, y1r);
            canvasContext.fill();

        },
        turnRight: function () {
            setValidDegree();

            if (sessionStorage.getItem("rotationDegree")) {
                this.angleRaw += Number(sessionStorage.getItem("rotationDegree"));
            } else if (localStorage.getItem("rotationDegree")) {
                this.angleRaw += Number(localStorage.getItem("rotationDegree"));
            } else {
                sessionStorage.setItem("rotationDegree", Number("5"));
                this.angleRaw += Number(localStorage.getItem("rotationDegree"));
            }
        },
        turnLeft: function () {
            setValidDegree();

            if (sessionStorage.getItem("rotationDegree")) {
                this.angleRaw -= Number(sessionStorage.getItem("rotationDegree"));
            } else if (localStorage.getItem("rotationDegree")) {
                this.angleRaw -= Number(localStorage.getItem("rotationDegree"));
            } else {
                sessionStorage.setItem("rotationDegree", Number("5"));
                this.angleRaw -= Number(localStorage.getItem("rotationDegree"));
            }
        },
        moveForward: function () {
            if (this.x > canvas.width) {
                this.x = 0;
            }

            if (this.x < 0) {
                this.x = canvas.width;
            }

            if (this.y > canvas.height) {
                this.y = 0;
            }

            if (this.y < 0) {
                this.y = canvas.height;
            }

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

/**
 *  This function generates instance of bullet.
 *  @param x x coordinate of ship
 *  @param y y coordinate of ship
 *  @param angle angle of ship
 *  @returns {{vecy: number, vecx: number, x, width: number, y, draw: draw}} instance of bullet
 */
function generateBullet(x, y, angle) {
    return {
        x: x,
        y: y,
        vecx: Math.sin(angle),
        vecy: Math.cos(angle),
        width: 6,
        draw: function () {
            canvasContext.fillRect(this.x - this.width/2, this.y - this.width/2, this.width, this.width);
        }
    }
}

/**
 *  This function generates instance of asteroid.
 *  @returns {{vecy: number, vecx: number, x: number, width: number, y: number, draw: draw}} instance of asteroid
 */
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
            canvasContext.lineTo(this.x , this.y);
            canvasContext.fill();
        }
    };
}

/**
 *  This function initialize number of asteroids and give them in asteroids array.
 */
function initAsteroids() {
    let amount;
    amount = Math.floor(Math.random() * 10 + 10);

    for(let i = 0; i < amount; i++) {
        asteroids.push(generateAsteroid());
    }
}

/**
 *  This function checks interference between asteroid and object.
 *  @param object can be ship or bullet
 *  @param asteroid instance of asteroid
 *  @returns {boolean} return true if interfered and false if not
 */
function checkInterference(object, asteroid) {


    if(object.x >= asteroid.x && object.y <= asteroid.y + asteroid.width / 2 && object.x - asteroid.x >= asteroid.y - object.y &&
        object.x <= asteroid.x + asteroid.width && object.y <= asteroid.y + asteroid.width / 2 && asteroid.x - object.x <= asteroid.y - object.y &&
        object.x >= asteroid.x && object.y >= asteroid.y - asteroid.width / 2 && object.x - asteroid.x >= object.y - asteroid.y &&
        object.x <= asteroid.x + asteroid.width && object.y >= asteroid.y - asteroid.width / 2 && asteroid.x - object.x <= object.y - asteroid.y) {
        return true;
    }

    // return object.x >= asteroid.x && object.x <= asteroid.x + asteroid.width &&
    //     object.y >= asteroid.y - asteroid.width / 2 && object.y <= asteroid.y + asteroid.width / 2;

}

/**
 *  This function moves bullet.
 *  @param bullet instance of bullet
 */
function moveBullet(bullet) {
    bullet.x += 5 * bullet.vecx;
    bullet.y += 5 * bullet.vecy * - 1;

    bullet.draw();

    if (bullet.x > canvas.width || bullet.x < 0 || bullet.y > canvas.height || bullet.y < 0) {
        let index = bullets.indexOf(bullet);
        bullets.splice(index, 1);
    }

}

/**
 *  This function moves asteroid.
 *  @param asteroid instance of asteroid
 */
function moveAsteroid(asteroid) {
    asteroid.draw();

    asteroid.x += asteroid.vecx;
    asteroid.y += asteroid.vecy;

    if (asteroid.x + asteroid.width / 2 > canvas.width) {
        asteroid.x = - asteroid.width / 2;
    }

    if (asteroid.x + asteroid.width / 2 < 0) {
        asteroid.x = canvas.width - asteroid.width / 2;
    }

    if (asteroid.y > canvas.height) {
        asteroid.y = - asteroid.y;
    }

    if (asteroid.y < 0) {
        asteroid.y = canvas.height + asteroid.y;
    }
}

/**
 *  This function calls function that moves ship or shoots bullet depending on pressed key.
 */
function shipAction() {
    const shipAction = {
        KeyD: "turnRight",
        KeyA: "turnLeft",
        KeyW: "moveForward",
        Space: "shoot"
    };
    for (let i in shipAction) {
        if (events[i]) {
            gShip[shipAction[i]]();
        }
    }

    gShip.applyAccel();
    gShip.draw();
}

/**
 *  This function renders score on canvas.
 */
function renderScore() {
    canvasContext.font = '20px serif';
    canvasContext.fillText('Skóre: ' + score, 10, 25);
}

/**
 *  This function renders live on canvas.
 */
function renderLife() {

    if (gShip.life > 3) {
        canvasContext.fillText("Životy: " + gShip.life.toString(), 10, 50)
    }

    if (gShip.life === 3) {
        canvasContext.fillRect( 10,  30, 10, 10);
        canvasContext.fillRect( 25,  30, 10, 10);
        canvasContext.fillRect( 40,  30, 10, 10);
    }

    if (gShip.life === 2) {
        canvasContext.fillRect( 10,  30, 10, 10);
        canvasContext.fillRect( 25,  30, 10, 10);
        canvasContext.strokeRect( 40,  30, 10, 10);
    }

    if (gShip.life === 1) {
        canvasContext.fillRect( 10,  30, 10, 10);
        canvasContext.strokeRect( 25,  30, 10, 10);
        canvasContext.strokeRect( 40,  30, 10, 10);
    }
}

/**
 *  This function renders canvas and check interference of objects.
 *  If the game ends and user got score better than one of top 10, then it shows input for nickname, else ask user question.
 */
function gameLoop() {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);

    bulletInterval++;

    shipAction();
    renderScore();
    renderLife();

    for (let bullet of bullets) {
        moveBullet(bullet);

        for (let asteroid of asteroids) {
            if (checkInterference(bullet, asteroid)) {
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
                asteroidHitTimeOut = null;
            }, 2000)

            renderLife();
            gShip.life--;

            if (gShip.life === 0) {
                $.ajax({
                    url: "https://akce.cu.ma/getJSON.php",
                    type: "GET",
                    crossDomain: true,
                    dataType: "json",
                    success: function (json) {
                        leaderboard = json;

                        if (leaderboard.scoreboard[leaderboard.scoreboard.length - 1].score >= score) {
                            gameRestartMenu();
                            return;
                        }

                        nickname.style.visibility = "visible";
                        nicknameInput.focus();
                    }
                });
                return;
            }
        }
    }

    if (escapeEvent["Escape"]) {
        escapeDiv.style.visibility = "visible";
        escapeResumeButton.focus();

        return;
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

/**
 *  This function checks if the input for nickname is valid.
 *  @returns {boolean} return false if input is valid and true when invalid
 */
function checkNickname() {
    if (nicknameInput.value.length === 0) {
        return true;
    }

    for (const letter of nicknameInput.value) {
        if (!(letter in allowedKeys)) {
            return true
        }
    }
    return false;
}

/**
 *  This function handles bad input from user in nickname.
 *  If the input is valid then changes leaderboard and call function saveJSON.
 */
function changeJSON() {
    if (checkNickname()) {
        let badNickname = document.getElementById("badNickname");
        badNickname.innerHTML = "Zadal jsi špatné jméno. <br> A-Z nebo a-z nebo 0-9, 1 až 15 znaků";
        return;
    }

    for (let i = 8; i >= 0; i--) {
        if (leaderboard.scoreboard[i].score >= score) {
            leaderboard.scoreboard[i + 1].score = score;
            leaderboard.scoreboard[i + 1].nickname = nicknameInput.value;
            break;
        } else {
            leaderboard.scoreboard[i + 1].score = leaderboard.scoreboard[i].score;
            leaderboard.scoreboard[i + 1].nickname = leaderboard.scoreboard[i].nickname;
        }
    }

    if (leaderboard.scoreboard[0].score < score) {
        leaderboard.scoreboard[0].score = score;
        leaderboard.scoreboard[0].nickname = nicknameInput.value;
    }

    saveJSON();
}

/**
 *  This function posts JSON file of leaderboard to save on server.
 *  Then calls function gameRestartMenu.
 */
function saveJSON() {
    $.ajax({
        url: "https://akce.cu.ma/saveJSON.php",
        type: "POST",
        dataType: "json",
        data: JSON.stringify(leaderboard)
    });

    gameRestartMenu();
}

/**
 *  This function shows user two buttons to choose from.
 *  Either take user to menu, or initialize and play new game.
 */
function gameRestartMenu(){
    nickname.style.visibility = "hidden";
    gameReset.style.visibility = "visible";

    gameResetButton.focus();
}

function cheat() {
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
}

/**
 *  This function resets instance of game.
 */
function resetInstance() {
    for (let i = asteroids.length; i > 0; i--) {
        asteroids.pop();
    }
    for (let i = bullets.length; i > 0; i--) {
        bullets.pop();
    }
    gShip = generateShip();
    initAsteroids();
    score = 0;
}

/**
 *  Initialization of objects, variables, event handlers and call function for game after the document is ready.
 */
$(document).ready( function () {
    canvas = document.getElementById('game');
    // canvas.height = window.innerHeight; //  - 25
    // canvas.width = window.innerWidth; // - 20
    canvasContext = canvas.getContext('2d');
    gShip = generateShip();
    initAsteroids();
    window.focus();

    nickname = document.getElementById("nickname");
    nicknameInput = document.getElementById("nicknameInput");

    gameReset = document.getElementById("gameReset");
    gameResetButton = document.getElementById("resetButton");
    gameEndButton = document.getElementById("endButton");

    escapeDiv = document.getElementById("escapeDiv");
    escapeResumeButton = document.getElementById("resumeButton");
    escapeResetButton = document.getElementById("escapeResetButton");
    escapeEndButton = document.getElementById("escapeEndButton");

    nicknameInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            changeJSON();
        }
    });

    nicknameInput.addEventListener("keydown", function (event) {
        if (event.ctrlKey && event.code === "KeyV") {
            event.preventDefault();
        }
    });

    document.addEventListener("keydown", function (event) {
        cheat(event);

        if (event.code === "Space") {
            event.preventDefault();
        }

        if (event.code in events) {
            events[event.code] = true;
        }
    });

    document.addEventListener("keyup", function (event) {
        if (event.code in events) {
            events[event.code] = false;
        }

        if (event.code === "Escape") {
            if (escapeEvent["Escape"] === false) {
                escapeEvent["Escape"] = true;
            } else {
                escapeDiv.style.visibility = "hidden";
                escapeEvent["Escape"] = false;
                gameLoop();
            }
        }
    });

    escapeResumeButton.onclick = function () {
        escapeDiv.style.visibility = "hidden";
        escapeEvent["Escape"] = false;
        gameLoop();
    };

    escapeEndButton.onclick = function () {
        location.href='menu.html';
    };

    escapeResetButton.onclick = function () {
        escapeDiv.style.visibility = "hidden";
        resetInstance();
        escapeEvent["Escape"] = false;
        gameLoop();
    }

    gameEndButton.onclick = function () {
        location.href='menu.html';
    };

    gameResetButton.onclick = function () {
        gameReset.style.visibility = "hidden";
        resetInstance();
        gameLoop();
    }

    gameLoop();
});