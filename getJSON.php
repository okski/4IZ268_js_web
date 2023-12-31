<?php
  // http://www.example.org/ajax.php
  if (!isset($_SERVER['HTTP_ORIGIN'])) {
      // This is not cross-domain request
      exit;
  }

  $wildcard = TRUE; // Set $wildcard to TRUE if you do not plan to check or limit the domains
  $credentials = FALSE; // Set $credentials to TRUE if expects credential requests (Cookies, Authentication, SSL certificates)
  $allowedOrigins = array('http://zinoui.com', 'http://jsfiddle.net');
  if (!in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins) && !$wildcard) {
      // Origin is not allowed
      exit;
  }
  $origin = $wildcard && !$credentials ? '*' : $_SERVER['HTTP_ORIGIN'];

  header("Access-Control-Allow-Origin: " . $origin);
  if ($credentials) {
      header("Access-Control-Allow-Credentials: true");
  }
  header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
  header("Access-Control-Allow-Headers: Origin");
  header('P3P: CP="CAO PSA OUR"'); // Makes IE to support cookies

  // Handling the Preflight
  if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { 
      exit;
  }

  // Response
  header("Content-Type: application/json; charset=utf-8");
  //$json = file_get_contents("leaderboard.json", true);
  //echo json_encode($json);
  //echo $json;
  readfile('leaderboard.json');
?>