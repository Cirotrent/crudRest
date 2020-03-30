
var sett;
var allSett;
var allReg;
var allProv;
var allCom;

var reg="";
var prov="";
var com;
function doCall(typeRequest, urlPath, parametri, callbackOnSuccess, callbackOnError) {
	$.ajax({
		url: urlPath,
		type: typeRequest,
		data: JSON.stringify(parametri),
		success: callbackOnSuccess,
		error: callbackOnError,
		headers: {
        	"Content-Type":'application/json',
        	'Accept': 'application/json'
        },
	});
}

function creaOptionSettore(){
	
	
	
	doCall('GET', 'http://212.237.32.76:3000/settore', {}, function(risposta){
		   //ON SUCCESS
			
			allSett=risposta;
			for(var i = 0; i < risposta.length; i++) {
				var ris= JSON.stringify(risposta[i]);
			    $("#settoreOptionId").append("<option class='form-control' value='"+ris+"'>"+risposta[i].descrizione+"</option>");
			}
			
	},function(e){
		stopSpinner();
		alert("errore nel server: "+e.status+" "+e.statusText);
	});

}

function creaOptionRegione(){
	showSpinner();

	doCall('GET', 'http://212.237.32.76:3000/geo/regioni', {}, function(risposta){
		   //ON SUCCESS
		   allReg=risposta;
		   $("#regioneOptionId").append("<option value='' selected='selected' disabled >"+"Seleziona una regione"+"</option>");
			for(var i = 0; i < risposta.length; i++) {
				var ris= JSON.stringify(risposta[i]);
			    $("#regioneOptionId").append("<option class='form-control' value='"+ris+"'>"+risposta[i].descrizione+"</option>");
			}
			stopSpinner();
	},function(e){
		stopSpinner();
		alert("errore nel server: "+e.status+" "+e.statusText);
	});

}

function creaOptionProvincia(){
	showSpinner();
	document.getElementById('provinciaOptionId').setAttribute("disabled", "disabled");
	document.getElementById('comuneOptionId').setAttribute("disabled", "disabled");
	reg=JSON.parse( $("#regioneOptionId").val());
	console.log(reg.descrizione);
	var lista= document.getElementById('provinciaOptionId');
	var opz = lista.getElementsByTagName("option");
	
	console.log(opz);
	
	 svuota(opz,lista);
	
	doCall('GET', 'http://212.237.32.76:3000/geo/province/'+reg.codice, {}, function(risposta){
		   //ON SUCCESS
		 
			allProv=risposta;
			document.getElementById('provinciaOptionId').removeAttribute("disabled");
 			$("#provinciaOptionId").append("<option value='' selected='selected' disabled >"+"Seleziona una provincia"+"</option>");
			$("#comuneOptionId").append("<option value='' selected='selected' disabled > "+"Seleziona un comune"+"</option>");
			for(var i = 0; i < risposta.length; i++) {
				var ris= JSON.stringify(risposta[i]);
			    $("#provinciaOptionId").append("<option class='form-control' value='"+ris+"'>"+risposta[i].descrizione+"</option>");
			}
			stopSpinner();
	},function(e){
		stopSpinner();
		alert("errore nel server: "+e.status+" "+e.statusText);
	});
}

function creaOptionComune(){
	showSpinner();
	document.getElementById('comuneOptionId').setAttribute("disabled", "disabled");
	
	prov=JSON.parse( $("#provinciaOptionId").val()); 
	var lista= document.getElementById('comuneOptionId');
	var opz = lista.getElementsByTagName("option");
	svuota(opz,lista);
		
	doCall('GET', 'http://212.237.32.76:3000/geo/comuni/'+prov.codice, {}, function(risposta){
		   //ON SUCCESS
			document.getElementById('comuneOptionId').removeAttribute("disabled");
		    allCom=risposta;
		    $("#comuneOptionId").append("<option value='' selected='selected' disabled > "+"Seleziona un comune"+"</option>");
			for(var i = 0; i < risposta.length; i++) {
				var ris= JSON.stringify(risposta[i]);
			    $("#comuneOptionId").append("<option class='form-control' value='"+ris+"'>"+risposta[i].descrizione+"</option>");
			}
			stopSpinner();
	},function(e){
		stopSpinner();
		alert("errore nel server: "+e.status+" "+e.statusText);
	});
 }

function executeInsert(){
	var nomeIn= $("#nomeId").val();
	var cognomeIn= $("#cognomeId").val();
	var dataIn= $("#dataId").val();
	var settoreIn=JSON.parse($("#settoreOptionId").val());
	var comuneIn=JSON.parse($("#comuneOptionId").val());
	var stipendioIn= $("#stipendioId").val();
	
	if ( controlloDati(nomeIn,cognomeIn,dataIn,settoreIn,reg,prov,comuneIn,stipendioIn)) {
		$("#ulId").show();
		return ;
	}
	showSpinner();
	doCall('POST', 'http://212.237.32.76:3000/risorsa', 
			{nome : nomeIn,cognome : cognomeIn,dataNascita : dataIn,
			residenza : {
				regione:{codice: reg.codice,descrizione: reg.descrizione},
				provincia: {codice: prov.codice, descrizione: prov.descrizione},
				comune: {codice: comuneIn.codice,descrizione: comuneIn.descrizione}
			},
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

function controlloDati(nome,cognome,data,settore,regione,provincia,comune,stipendio) {
	$("#ulId").empty();
	var result= false;

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


