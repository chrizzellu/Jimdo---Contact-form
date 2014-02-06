<?

include_once ('functions.php');
if(
	isset ($_POST['url']) 
	) {
		$url = $_POST['url'];
		$data = (object) array ();

		if ($url == 'free') {
			$data->package = 'JimdoFree';
		} elseif ($url == 'pro') {
			$data->package = 'JimdoPro';
		} elseif ($url == 'business') {
			$data->package = 'JimdoBusiness';
		} else {
			$data->package = 'keine valide Jimdo Seite';
		}
		echo json_builder ($data);
	}
?>

