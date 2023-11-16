function submitForm(event) {
	event.preventDefault();

	var ime = document.getElementById("ime").value;
	var prezime = document.getElementById("prezime").value;
	var email = document.getElementById("email").value;
	var lozinka = document.getElementById("lozinka").value;

	//dodatne provjere unosa
	if (!ime || !prezime || !email || !lozinka) {
		alert("Molimo popunite sva polja.");
		return;
	}

	var lozinkaRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
	if (!lozinkaRegex.test(lozinka)) {
		alert("Lozinka mora sadržavati barem 8 znakova, barem jedno veliko slovo i barem jedan broj.");
		return;
	}

	//simulacija slanja podataka na server
	fetch('/register', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ ime, prezime, email, lozinka }),
	})
		.then(response => response.json())
		.then(data => {
			//ovdje obraditi odgovor sa servera, trenutno ga ignoriramo

			console.log(data);

			alert("Uspješno ste se registrirali!\nIme: " + ime + "\nPrezime: " + prezime + "\nEmail: " + email);

			//ocisti polja za unos nakon uspjesne registracije
			document.getElementById("ime").value = "";
			document.getElementById("prezime").value = "";
			document.getElementById("email").value = "";
			document.getElementById("lozinka").value = "";

			
		})
		.catch(error => {
			console.error('Error:', error);
			alert('Došlo je do pogreške prilikom registracije.');
		});
}
