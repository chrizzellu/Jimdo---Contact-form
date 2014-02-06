<?php
function json_builder ($data)
{
 global $query,
 $block,
 $dyn;

 $output = '{';
 $output.= '"success":true,';

 if (is_bool ($data) === true)
	 {
	 $output.= '"bool":';
	 $output.= ($data) ? 'true' : 'false';

	 }
 else
	 {
	 $output.= '"data":';
	 $json_obj = array ();

	 if (!is_array ($data))
		 {
		 if ($data === 0 || $data == null)
			 {
			 $output.= '[]';
			 }
		 else
			 {
			 $json = '{';
			 $json.= '"key":'.json_encode ($query).',';

			 if (gettype ($data) == 'object')
				 {
				 $block = 'content';
				 }
			 else
				 {
				 $block = 'error';
				 }


			 $json.= '"block":'.json_encode ($block).',';

			 $json.= '"dyn":'.json_encode ($dyn).',';
			 $json.= '"value": '.json_encode ($data);
			 $json.= '}';
			 $output.= $json;
			 }
		 }
	 else
		 {
		 $output.= '[';
		 foreach ($data as $key => $row)
		 {
			 if ($block[$key] == null)
				 {
				 $block[$key] = 'content';
				 }

			 $json = '{';
			 $json.= '"key":'.json_encode (sizeof ($json_obj)).',';
			 $json.= '"block":'.json_encode ($block[$key]).',';

			 if (gettype ($dyn) == 'array')
				 {
				 $json.= '"dyn":'.json_encode ($dyn[$key]).',';
				 }
			 $json.= '"value": '.json_encode ($row);
			 $json.= '}';

			 $json_obj[] = $json;
		 }
		 $output.= implode (", ", $json_obj);
		 $output.= ']';
		 }

	 }
 $output.= '}';

 return $output;
}
?>