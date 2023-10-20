var leaderboard;
var tBody;

/**
 *  This initializes variables and call function fillTable
 */
$(document).ready( function () {
    tBody = document.getElementById("tbody");

    $.ajax({
        url: "https://akce.cu.ma/getJSON.php",
        type: "GET",
        dataType: "json",
        crossDomain: true,
        success: function (data) {
            leaderboard = data;
            fillTable();
        }
    });
})

/**
 *  This function fills table with JSON data.
 */
function fillTable() {
    // console.log(leaderboard);
    //
    // console.log(tBody.innerHTML);


    for (let i = 0; i < 10; i++) {
        let row;
        let cell1, cell2, cell3;

        row = tBody.insertRow(i);

        cell1 = row.insertCell(0);
        cell2 = row.insertCell(1);
        cell3 = row.insertCell(2);

        cell1.innerHTML = (i + 1).toString() + ".";
        cell2.innerHTML = leaderboard.scoreboard[i].nickname;
        cell3.innerHTML = leaderboard.scoreboard[i].score;

    }
}