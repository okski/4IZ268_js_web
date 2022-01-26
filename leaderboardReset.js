var leaderboard;

/**
 *  This gets empty JSON and calls function postFunction.
 */
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

/**
 *  This funtion post empty JSON to server.
 */
function postFunction() {
    $.ajax({
        url: "https://akce.cu.ma/saveJSON.php",
        type: "POST",
        dataType: "json",
        data: JSON.stringify(leaderboard),
    });
}

