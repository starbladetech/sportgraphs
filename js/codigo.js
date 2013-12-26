function DifHoras(laHora1, laHora2){
	var hms1 = laHora1.split(':');
	var hms2 = laHora2.split(':');
	
	if(hms2[2]>hms1[2])
	{
		return hms2[2]-hms1[2];
	}
	else
	{
		return parseInt(hms2[2]) + parseInt((60 - hms1[2]));
	}
}

function GetDiftime(tiempo){
	//console.log(tiempo);
	//console.log(DifHoras(tiempo[0],tiempo[1]));
	var tiempoacumulado = [];
	var pivote = 0;
	$.each( tiempo, function( key, value ) {
		if(key==0)
		{
			tiempoacumulado.push(0);
		}
		else
		{
			tiempoacumulado.push(DifHoras(pivote, value));
			//alert(pivote +' '+value);
		}
		pivote = value;
	});
	
	var acum = 0;
	var tiemposumado = [];
	tiemposumado.push(acum);
	$.each( tiempoacumulado, function( key, value ) {
		if(key!=0)
		{
			acum = acum + value;
			tiemposumado.push(acum);
		}
	});
	return tiemposumado;
}

function GraficaPuntos(recorrido, SumTime, salto){

	var last_element = recorrido[recorrido.length - 1];
	var elfor = Math.floor(last_element);
	
	var last_time = SumTime[SumTime.length - 1];
	var saltosRec = [];
	var saltosTim = [];
	
	var paso = 0;
	
	$.each( recorrido, function( key, value ) {
		if(value >= paso)
		{
			saltosRec.push(paso);
			saltosTim.push(parseInt(SumTime[key])/60);
			paso=paso+salto;
			//console.log(value+' '+SumTime[key]);
		}
	});
	saltosRec.push(last_element);
	saltosTim.push(parseInt(last_time)/60);
	
	/* --- CÁLCULO DE LA LINEA IDEAL A 5 MIN/KM --- */
	
	var saltosTimIdeal = [];
	$.each( saltosRec, function( key, value ) {
	
			saltosTimIdeal.push((parseFloat(value)*300)/60);
	});
	/* --- ------------------------------------ --- */
	$('#container').highcharts({
        chart: {
			//height: 200
        },
        xAxis: {
            categories: saltosRec,
			title: {
                enabled: true,
                text: '<b>Distancia (km)</b>',
                style: {
                    fontWeight: 'normal'
                }
            }
        },
		yAxis: {
			title: {
                enabled: true,
                text: '<b>Tiempo (min)</b>',
                style: {
                    fontWeight: 'normal'
                }
            }
        },
		title: {
            text: 'Tiempo - Distancia'  
        },
        plotOptions: {
            series: {
                color: '#FF0000'
            }
        },
        series: [{
			type: 'line',
            data: saltosTim,
			name: 'Real'
			},
			{
			type: 'line',
            data: saltosTimIdeal,
			name: 'Ideal',
			color: 'blue'
        }]
    });
}