<?php
    $fp = fopen('leaderboard.json', "r");
    fwrite($fp, json_encode($_POST));
    fclose($fp);
?>
