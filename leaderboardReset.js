var leaderboard;

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

function postFunction() {
    $.ajax({
        url: "https://akce.cu.ma/saveJSON.php",
        type: "POST",
        dataType: "json",
        data: JSON.stringify(leaderboard),
        success: function () {
            document.write('<h1>Success</h1>');
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest, textStatus, errorThrown);
        }
    });
}

