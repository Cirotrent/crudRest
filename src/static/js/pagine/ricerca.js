function creaOption() {

	doCall('GET', 'http://212.237.32.76:3000/settore', {}, function(risposta) {
		// ON SUCCESS
		console.log(risposta);

		for (var i = 0; i < risposta.length; i++) {
			$("#optionId").append(
					"<option class='form-control' value='" + risposta[i].codice
							+ "'>" + risposta[i].descrizione + "</option>");
		}
	});
}

function creaTabella(risposta) {
	console.log()
	$.each(risposta, function(key, val) {
		var tdId = '<td>' + val._id + '</td>';
		var tdNome = '<td>' + val.nome + '</td>';
		var tdCognome = '<td>' + val.cognome + '</td>';
		var tdData = '<td>' + val.dataNascita + '</td>';
		if (val.residenza) {
			var regione = '<td>' + val.residenza.regione.descrizione + '</td>';
			var provincia = '<td>' + val.residenza.provincia.descrizione
					+ '</td>';
			var comune = '<td>' + val.residenza.comune.descrizione + '</td>';
		} else {
			var regione = '<td>' + "nessuna" + '</td>';
			var provincia = '<td>' + "nessuna" + '</td>';
			var comune = '<td>' + "nessuna" + '</td>';
		}
		var tdSettore = '<td>' + val.settore.descrizione + '</td>';
		var tdStipendio = '<td>' + val.stipendioRAL + '</td>';

		$('#my_table').append(
				'<tr>' + tdId + tdNome + tdCognome + tdData + regione
						+ provincia + comune + tdSettore + tdStipendio
						+ '</tr>')

	});

}

function doCall(typeRequest, urlPath, parametri, callbackOnSuccess) {
	$.ajax({
		url : urlPath,
		type : typeRequest,
		data : JSON.stringify(parametri),
		success : callbackOnSuccess,
		headers : {
			"Content-Type" : 'application/json',
			'Accept' : 'application/json',
		}
	});
}

function executeRicerca() {
	var nome = $("#nomeId").val();
	var cognome = $("#cognomeId").val();
	var settore = $("#settoreId").val();

	doCall('GET', 'http://212.237.32.76:3000/risorsa?nome=' + nome
			+ '&cognome=' + cognome + '&codiceSettore=' + settore, {},
			function(risposta) {
				// ON SUCCESS
				console.log(risposta);
//				var res = document.getElementById('my_table');
//				res.setAttribute("style", "visibility: visible");
				$("#my_table").show();
				creaTabella(risposta);
			});
}

function indietro() {
	$("#my_table").empty();
	$("#my_table").hide();
}
