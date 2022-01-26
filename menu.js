var leaderboard, buffer = [];

/**
 *  This initializes eventListener and if buffer is correct then call function getEmptyJSON.
 */
$(document).ready( function () {
    window.addEventListener("keypress", function (event) {
        if (event.code === "KeyR") {
            buffer[0] = "r";
        }
        if (event.code === "KeyE" && buffer[0] === "r" && buffer.length === 1) {
            buffer[1] = "e";
        }
        if (event.code === "KeyS" && buffer[0] === "r" && buffer[1] === "e") {
            buffer[2] = "s";
        }
        if (event.code === "KeyE" && buffer[0] === "r" && buffer[1] === "e" && buffer[2] === "s") {
            buffer[3] = "e";
        }
        if (event.code === "KeyT" && buffer[0] === "r" && buffer[1] === "e" && buffer[2] === "s" && buffer[3] === "e") {
            getEmptyJSON();
        }
    })
})

/**
 *  This gets empty JSON and if successful calls function postFunction.
 */
function getEmptyJSON() {
    $.ajax({
        url: "https://eso.vse.cz/~hosj03/klient_web/leaderboard.json",
        type: "GET",
        dataType: "json",
        crossDomain: true,
        success: function (data) {
            leaderboard = data;
            postFunction();
        }
    });
}

/**
 *  This funtion post empty JSON to server.
 */
function postFunction() {
    $.ajax({
        url: "https://akce.cu.ma/saveJSON.php",
        type: "POST",
        dataType: "json",
        data: JSON.stringify(leaderboard)
    });
}