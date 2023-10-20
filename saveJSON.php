<?php
  header("Access-Control-Allow-Origin: *");
  header("Access-Control-Max-Age: 1000");
  header("Access-Control-Allow-Headers: X-Requested-With, Content-Type, Origin, Cache-Control, Pragma, Authorization, Accept, Accept-Encoding");
  header("Access-Control-Allow-Methods: PUT, POST, GET");
  // Takes raw data from the request
  $json = file_get_contents('php://input');
  // $injection = random_int(1, PHP_INT_MAX/2);

  // Converts it into a PHP object
  $data = json_decode($json);

    foreach ($data->scoreboard as $scoreboard) {
  	$nickname = $scoreboard->nickname;
    $score = $scoreboard->score;
    
    if ($score == "" && $nickname == "") {
      continue;
    }
    
    // echo "for";
    
    //var_dump($nickname . $score);
    
    $nickname = filter_var($nickname, FILTER_VALIDATE_REGEXP, array("options" => array("regexp"=>"/^[A-Za-z0-9]{1,15}$/")));
    
    $score = filter_var($score, FILTER_VALIDATE_INT, array("options" => array("min_range"=>1)));
    
    if ($nickname == false || $score == false) {
      // $nickname = "injection_" . strval($injection); 
      echo json_encode(array('status' => 'BAD_INPUT'));
      return;
    }
    
    // $nickname = trim($nickname);
    // $nickname = strip_tags($nickname);
    // $nickname = addslashes($nickname, FILTER_SANITIZE_ADD_SLASHES);
    // $nickname = filter_var($nickname, FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_LOW);
    // $nickname = htmlentities($nickname, ENT_QUOTES,'UTF-8');
  }

  file_put_contents("leaderboard.json", $json);
  echo json_encode(array('status' => 'OK'));
?>