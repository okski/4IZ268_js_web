var leaderboard, buffer = [];

$(document).ready( function () {
    // if (localStorage.getItem("rotationDegree") && sessionStorage.isNewSession) {
    //     sessionStorage.setItem("rotationDegree", localStorage.getItem("rotationDegree"));
    // }


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

function postFunction() {
    $.ajax({
        url: "https://akce.cu.ma/saveJSON.php",
        type: "POST",
        dataType: "json",
        data: JSON.stringify(leaderboard),
        // success: function () {
        //     document.write('<h1>Success</h1>');
        // },
        // error: function (XMLHttpRequest, textStatus, errorThrown) {
        //     console.log(XMLHttpRequest, textStatus, errorThrown);
        // }
    });
}