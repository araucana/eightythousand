<?php

// this code is pretty insecure. I would not deploy this as is.
$url = 'https://api.sendgrid.com/';
$user = 'asdfasdfafd';
$pass = 'chickensarethebest22';

$params = array(
    'api_user'  => $user,
    'api_key'   => $pass,
    'to'        => $_POST["email"],
    'subject'   => '80,000 Career Capital Recommendation Results',
    'html'      => $_POST["url"],
    'text'      => $_POST["url"],
    'from'      => 'testing@800000hours.org',
  );


$request =  $url.'api/mail.send.json';

// Generate curl request
$session = curl_init($request);
// Tell curl to use HTTP POST
curl_setopt ($session, CURLOPT_POST, true);
// Tell curl that this is the body of the POST
curl_setopt ($session, CURLOPT_POSTFIELDS, $params);
// Tell curl not to return headers, but do return the response
curl_setopt($session, CURLOPT_HEADER, false);
// Tell PHP not to use SSLv3 (instead opting for TLS)
curl_setopt($session, CURLOPT_SSLVERSION, CURL_SSLVERSION_TLSv1_2);
curl_setopt($session, CURLOPT_RETURNTRANSFER, true);

// obtain response
$response = curl_exec($session);
curl_close($session);

// print everything out
print_r($response);

?>
