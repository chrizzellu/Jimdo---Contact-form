<?
include_once ('functions.php');
if(
	isset ($_POST['name']) &&
	isset ($_POST['email']) &&
	isset ($_POST['url']) &&
	isset ($_POST['subject']) &&
	isset ($_POST['questions'])
	
	) {
		$name = $_POST['name'];
		$email = $_POST['email'];
		$url = $_POST['url'];
		$subject = $_POST['subject'];
		$questions = $_POST['questions'];
		
		$mgmt_url = 'http://mgmt...'; //placeholder
		//$website_id = get_website_id($url);
		//$mgmt_url = 'https://mgmt.jimdo-server.com/website/index/index/?w='.$website_id;
		
		
		//Send Mail Begin
		$to      = 'chris@jimdo.com';
		$headers = 'From: '.$email. "\r\n" .
			'Reply-To: '.$email.'' . "\r\n" .
			'X-Mailer: PHP/' . phpversion();
			
		$message = "Website: ".$url." \n\n";
		$message .= "Mgmt: ".$mgmt_url." \n\n";
		$message .= "Name: ".$name."\n\n";
		$message .= "Subject: ".$subject."\n\n";
		$message .= "Question: ".$questions."\n";
		
		mail($to, $subject, $message, $headers);
		//Sent Mail End
		
		
		$data = (object) array ();
		$data->send_notification = 'SENT';
		$data->package = 'FREE';
		echo json_builder ($data);
	}
?>
