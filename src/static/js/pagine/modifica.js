var idInput;
	var reg;
	var prov;
	var com;
	
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
	
	function creaOptionsRegione(residenza){
		
		doCall('GET', 'http://212.237.32.76:3000/geo/regioni', {}, function(risposta){
			   //ON SUCCESS
				for(var i = 0; i < risposta.length; i++) {
					var ris= JSON.stringify(risposta[i]);
					 if(residenza.regione.codice==risposta[i].codice){
						$("#regioneOptionId").append("<option class='form-control' selected value='"+ris+"'>"+risposta[i].descrizione+"</option>");
					}else $("#regioneOptionId").append("<option class='form-control' value='"+ris+"'>"+risposta[i].descrizione+"</option>");

				}
		},function(e){
			stopSpinner();
			alert("errore nel server: "+e.status+" "+e.statusText);
		});
	}
	
	function creaOptionProvincia(residenza){
		document.getElementById('provinciaOptionId').setAttribute("disabled", "disabled");
		document.getElementById('comuneOptionId').setAttribute("disabled", "disabled");
		if(isBlank(residenza)){
			showSpinner();
			reg=JSON.parse( $("#regioneOptionId").val());
			}else{
				reg=residenza.regione;
			}
		
		var lista= document.getElementById('provinciaOptionId');
		var opz = lista.getElementsByTagName("option");
		svuota(opz,lista);
			
		doCall('GET', 'http://212.237.32.76:3000/geo/province/'+reg.codice, {}, function(risposta){
			   //ON SUCCESS
			
				document.getElementById('provinciaOptionId').removeAttribute("disabled");
				if(isBlank(residenza)){
					stopSpinner();
					$("#provinciaOptionId").append("<option value='' selected='selected' disabled >"+"Seleziona una provincia"+"</option>");
					$("#comuneOptionId").append("<option value='' selected='selected' disabled > "+"Seleziona un comune"+"</option>");			
					}

				for(var i = 0; i < risposta.length; i++) {
					var ris= JSON.stringify(risposta[i]);
					if(!isBlank(residenza) && residenza.provincia.codice==risposta[i].codice){
						$("#provinciaOptionId").append("<option class='form-control' selected value='"+ris+"'>"+risposta[i].descrizione+"</option>");
					}else $("#provinciaOptionId").append("<option class='form-control' value='"+ris+"'>"+risposta[i].descrizione+"</option>");
				}
			   
		},function(e){
			stopSpinner();
			alert("errore nel server: "+e.status+" "+e.statusText);
		});
	}
	
	function creaOptionComune(residenza){
		document.getElementById('comuneOptionId').setAttribute("disabled", "disabled");
		if(!residenza){
			showSpinner();
			prov =JSON.parse( $("#provinciaOptionId").val());
			}else {
				prov=residenza.provincia;
			}
		
		var lista= document.getElementById('comuneOptionId');
		var opz = lista.getElementsByTagName("option");
		svuota(opz,lista);
			
		doCall('GET', 'http://212.237.32.76:3000/geo/comuni/'+prov.codice, {}, function(risposta){
			   //ON SUCCESS
				document.getElementById('comuneOptionId').removeAttribute("disabled");
			    if(isBlank(residenza)){
			    	stopSpinner();
				    $("#comuneOptionId").append("<option value='' selected='selected' disabled > "+"Seleziona un comune"+"</option>");
				}
				for(var i = 0; i < risposta.length; i++) {
					var ris=JSON.stringify(risposta[i]);
					if(!isBlank(residenza) && residenza.comune.codice==risposta[i].codice){
						$("#comuneOptionId").append("<option class='form-control' selected value='"+ris+"'>"+risposta[i].descrizione+"</option>");
					}else $("#comuneOptionId").append("<option class='form-control' value='"+ris+"'>"+risposta[i].descrizione+"</option>");

				}
		},function(e){
			stopSpinner();
			alert("errore nel server: "+e.status+" "+e.statusText);
		});
	}
	
	

	function creaOptionsSettore(_settore){
		
		doCall('GET', 'http://212.237.32.76:3000/settore', {}, function(risposta){
			   //ON SUCCESS
				for(var i = 0; i < risposta.length; i++) {
					var ris = JSON.stringify(risposta[i]);
					if(_settore.codice==risposta[i].codice){
						$("#settoreOptionId").append("<option class='form-control' selected value='"+ris+"'>"+risposta[i].descrizione+"</option>");
					}else $("#settoreOptionId").append("<option class='form-control' value='"+ris+"'>"+risposta[i].descrizione+"</option>");
				}
		},function(e){
			stopSpinner();
			alert("errore nel server: "+e.status+" "+e.statusText);
		});
	}
	
	function executeDettaglio(){
		
		var id = $("#inputId").val();
		if(controllaId(id)){
			$("#errorId").show();
			return;
		}else{
			$("#errorId").empty();
			$("#errorId").hide();
		}
		$("#dettaglioId").hide();
		showSpinner();
		doCall('GET', 'http://212.237.32.76:3000/risorsa/'+id, {}, function(risposta){
			   //ON SUCCESS
			   console.log(risposta);
            var res= document.getElementById('modificaId');
            res.setAttribute("style","visibility: visible");
            
            idInput=risposta._id;
        	var nome = risposta.nome;
        	var cognome = risposta.cognome;
        	var dataNascita = risposta.dataNascita;
        	var residenza=risposta.residenza;
        	var settore = risposta.settore;
        	var stipendio = risposta.stipendioRAL;
        	
        	
        	document.getElementById('nomeId').value = nome;
        	document.getElementById('cognomeId').value =cognome;
        	document.getElementById('dataId').value =dataNascita;
        	document.getElementById('stipendioId').value =stipendio;
        	creaOptionsRegione(residenza);
        	creaOptionProvincia(residenza);
        	creaOptionComune(residenza);
        	creaOptionsSettore(settore);
        	document.getElementById('provinciaOptionId').removeAttribute("disabled");
        	document.getElementById('comuneOptionId').removeAttribute("disabled");
        	stopSpinner();
		},function(e){
			stopSpinner();
			alert("errore nel server: "+e.status+" "+e.statusText);
		});
	}
	
	function executeModifica(){
		
		var nomeIn= $("#nomeId").val();
		var cognomeIn= $("#cognomeId").val();
		var dataIn= $("#dataId").val();
		var settoreIn=JSON.parse($("#settoreOptionId").val());
		var comuneIn=JSON.parse($("#comuneOptionId").val());
		var stipendioIn= $("#stipendioId").val();
		
		var provIn=JSON.parse($("#provinciaOptionId").val());
		if ( controlloDati(nomeIn,cognomeIn,dataIn,settoreIn,reg,provIn,comuneIn,stipendioIn)) {
			$("#ulId").show();
			return ;
		}
		showSpinner();
		doCall('PUT', 'http://212.237.32.76:3000/risorsa', {_id : idInput,  nome : nomeIn,cognome : cognomeIn,dataNascita : dataIn,
			residenza : {regione:{codice: reg.codice,descrizione: reg.descrizione},
				provincia: {codice: prov.codice, descrizione: prov.descrizione},
				comune: {codice: comuneIn.codice,descrizione: comuneIn.descrizione}},
				settore : {codice : settoreIn.codice,descrizione : settoreIn.descrizione},
				stipendioRAL : stipendioIn}, function(risposta){
					//ON SUCCESS
			   console.log(risposta);
			   $("#ulId").toggle();
			   stopSpinner();
				alert("inserimento avvenuto con successo!");
		},function(e){
			stopSpinner();
			alert("errore nel server: "+e.status+" "+e.statusText);
		});
	}
	
	function svuota(op,el){
		
		for(var i=op.length-1;i>=0;i--){
			el.removeChild(op[i]);
		}
	}
	
	function isBlank(str) {
	    return (!str || /^\s*$/.test(str));
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
	
	function controlloDati(nome,cognome,data,settore,regione,provincia,comune,stipendio) {
		$("#ulId").empty();
		var result= false;
		console.log(provincia);
		if (!nome || /^\s*$/.test(nome)) {
			$("#ulId").append("<li>"+"Compila il campo nome"+"</li>");
			result=true;
		}
		if (!cognome || /^\s*$/.test(cognome)) {
			$("#ulId").append("<li>"+"Compila il campo cognome"+"</li>");
			result=true;
		}
		if (!data || /^\s*$/.test(data)) {
			$("#ulId").append("<li>"+"Compila il campo data di nascita"+"</li>");
			result=true;
		}
		if (!settore|| /^\s*$/.test(settore)) {
			$("#ulId").append("<li>"+"Seleziona un settore"+"</li>");
			result=true;
		}
		if (!regione|| /^\s*$/.test(regione)) {
			$("#ulId").append("<li>"+"Seleziona una regione"+"</li>");
			result=true;
		}
		if (!provincia|| /^\s*$/.test(provincia)) {
			$("#ulId").append("<li>"+"Seleziona una provincia"+"</li>");
			result=true;
		}
		if (!comune|| /^\s*$/.test(comune)) {
			$("#ulId").append("<li>"+"Seleziona un comune"+"</li>");
			result=true;
		}
		if (!stipendio || /^\s*$/.test(stipendio)) {
			$("#ulId").append("<li>"+"Compila il campo stipendioRAL"+"</li>");
			result=true;
		}
		return result;
	}
	function indietro() {
		$("#modificaId").hide();
		$("#dettaglioId").show();
		$("#regioneOptionId").empty();
		$("#provinciaOptionId").empty();
		$("#comuneOptionId").empty();
		$("#settoreOptionId").empty();
		$("#ulId").empty();
	}