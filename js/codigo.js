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

function FormateoTime(milisegundos){
	var horas = 0;
	var minutos = 0;
	var segundos = 0;
	
	var cociente = Math.floor(parseInt(milisegundos) / 3600000);
	var resto = parseInt(milisegundos) % 3600000;
	
	if(cociente>1)
	{
		horas = cociente;
	}
		cociente = Math.floor(resto / 60000);
		resto = resto % 60000;
		
		if(cociente>1)
		{
			minutos = cociente;
		}
			segundos = resto/1000;
	
		return horas+'h:'+minutos+'m:'+segundos+'s';
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
			saltosTim.push(parseInt(SumTime[key]));
			paso=paso+salto;
			//console.log(value+' '+SumTime[key]);
		}
	});
	saltosRec.push(last_element);
	saltosTim.push(parseInt(last_time));
	
	/* --- CÁLCULO DE LA LINEA IDEAL A 5 MIN/KM --- */
	
	var saltosTimIdeal = [];
	$.each( saltosRec, function( key, value ) {
	
			saltosTimIdeal.push((parseFloat(value)*300));
	});
	
	/* --- PREPARAR LOS DATOS PARA HIGHCHARTS ---*/
	var datalin=new Array(saltosRec.length);
	var datalinIdeal=new Array(saltosRec.length);
	
	for (var i = 0; i < saltosRec.length; i++) {
		datalin[i] = new Array(2);
		datalinIdeal[i] = new Array(2);
	}
	for(var cursor=0; cursor < saltosRec.length; cursor++)
	{
		datalin[cursor][0] = saltosRec[cursor];
		datalin[cursor][1] = saltosTim[cursor]*1000+Date.UTC(2013,12,14,17,18,47);
		
		datalinIdeal[cursor][0] = saltosRec[cursor];
		datalinIdeal[cursor][1] = saltosTimIdeal[cursor]*1000+Date.UTC(2013,12,14,17,18,47);
	}
	/* --- ------------------------------------ --- */
	$('#container').highcharts({
        chart: {
			//height: 200
        },
        xAxis: {
            //categories: saltosRec,
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
                text: '<b>Tiempo</b>',
                style: {
                    fontWeight: 'normal'
                }
            },
			type: 'datetime',
            dateTimeLabelFormats: {
                second: '%H:%M:%S',
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
		tooltip: {
            formatter: function() {
			
                return 'El tiempo para <b>'+ this.x +
                    ' km</b> es <b>'+ FormateoTime(this.y-Date.UTC(2013,12,14,17,18,47)) +'</b>';
            }
        },
        series: [{
			type: 'line',
            data: datalin,
			name: 'Real'
			},
			{
			type: 'line',
            data: datalinIdeal,
			name: 'Ideal',
			color: 'blue'
        }]
    });
}