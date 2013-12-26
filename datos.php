<?php
header("Content-type: text/javascript");
function DegToRad($anguloDeg){
	return ($anguloDeg*pi())/180;
}
function Distancia($lat1,$lon1,$lat2,$lon2)
{
	$R = 6371;
	$dLat = DegToRad($lat2-$lat1);
	$dLon = DegToRad($lon2-$lon1);
	$lat1 = DegToRad($lat1);
	$lat2 = DegToRad($lat2);

	$a = sin($dLat/2) * sin($dLat/2) +
			sin($dLon/2) * sin($dLon/2) * cos($lat1) * cos($lat2); 
	$c = 2 * atan2(sqrt($a), sqrt(1-$a)); 
	$d = $R * $c;

		return $d;
}

if (file_exists('practica.xml')) {
    $datos = simplexml_load_file('practica.xml');
 
    //print_r($datos);
} else {
    exit('Error abriendo practica.xml.');
}
//var_dump($datos);
$arraydatos=array();
$contador=0;

foreach ($datos->trk->trkseg[0]->trkpt as $valor) {
	$latitud = strval($valor->attributes()->lat);
	$longitud = strval($valor->attributes()->lon);
	
	$elevacion = strval($valor->ele);
	$tiempo = strval($valor->time);
	if($contador==0)
	{
		$distancia=0;
		$lat=$latitud;
		$lon=$longitud;
	}
	else
	{
		$distancia += Distancia($latitud, $longitud, $lat, $lon);
		$lat=$latitud;
		$lon=$longitud;
	}
	if($elevacion != '')
	{
		$arraydatos[] = array('latitud'=>$latitud, 'longitud'=>$longitud, 'elevacion'=>$elevacion, 'distancia'=>$distancia, 'tiempo'=>$tiempo);
	}
	$contador++;
}
$datosjson = json_encode($arraydatos);
echo $datosjson;

?>