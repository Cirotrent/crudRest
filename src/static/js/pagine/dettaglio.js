var id;
function doCall(typeRequest, urlPath, parametri, callbackOnSuccess,callbackOnError) {
		$.ajax({
			url: urlPath,
			type: typeRequest,
			data: JSON.stringify(parametri),
			success: callbackOnSuccess,
			error: callbackOnError,
			headers: {
	        	"Content-Type":'application/json',
	        	'Accept': 'application/json',
	        }
		});
	}
	
	function executeDettaglio(){
		id = $("#inputId").val();
		if(controllaId(id)){
			$("#errorId").show();
			return;
		}else{
			$("#errorId").empty();
			$("#errorId").hide();
		}
		showSpinner();
		$("#res").hide();
		doCall('GET', 'http://212.237.32.76:3000/risorsa/'+id, {}, function(risposta){
			   //ON SUCCESS
            $("#result").show();
            stopSpinner();
        	$("#idIn").html(risposta._id);
        	$("#nome").html(risposta.nome);
        	$("#cognome").html(risposta.cognome);
        	$("#data").html(risposta.dataNascita);
        	if(risposta.residenza){
        		$("#res").show();
        		$("#regione").html(risposta.residenza.regione.descrizione);
            	$("#provincia").html(risposta.residenza.provincia.descrizione);
            	$("#comune").html(risposta.residenza.comune.descrizione);
        	}
        	$("#settore").html(risposta.settore.descrizione +" ("+risposta.settore.codice+")");
        	$("#stipendio").html(risposta.stipendioRAL);
        	
		},function(e){
			stopSpinner();
			alert("errore nel server: "+e.status+" "+e.statusText);
		});
	}
	
	function showSpinner(){
		$("#fakeLoaderId").addClass("fakeLoader");
		$("#fakeLoaderId").show();
		
		console.log("start Spinner");
		$.fakeLoader({
	                    bgColor: '#3498db',
	                    spinner:"spinner1",
						timeToHide: 999999999
	                });
	}

	function stopSpinner(){
		var fadeOutDelay = 0;
		var fadeOutTime = 1000;
		
		setTimeout(function(){ 
			$("#fakeLoaderId").fadeOut(fadeOutTime);
		}, fadeOutDelay);
	    
	}
	
	function controllaId(id) {
		var result=false;
		if(id.length!=24){
			$("#errorId").html("L'id inserito non e' valido!");
			result= true;
		}
		return result;
	}