function elimina(){
	showSpinner();
	doCall('DELETE', 'http://212.237.32.76:3000/risorsa/'+id, {}, function(risposta){
		   //ON SUCCESS
		stopSpinner();
		alert("eliminazione avvenuta con successo");
 	
	},function(e){
		stopSpinner();
		alert("errore nel server: "+e.status+" "+e.statusText);
	});
}