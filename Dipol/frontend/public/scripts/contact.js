function submitContactForm(event) {
    event.preventDefault();

    var ime = document.getElementById("ime").value;
    var prezime = document.getElementById("prezime").value;
    var email = document.getElementById("email").value;
    var poruka = document.getElementById("poruka").value;

    //validacija i ostale provjere podataka

    //priprema podataka za slanje na server
    var formData = {
        ime: ime,
        prezime: prezime,
        email: email,
        poruka: poruka
    };

    //fetch API za slanje podataka na server
    fetch('/kontakt', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Nastao je problem s mrežom');
        }
        return response.json();
    })
    .then(data => {
        //uspjesno primljen odgovor od servera
        alert("Uspješno ste poslali poruku!\nIme: " + data.ime + "\nPrezime: " + data.prezime + "\nEmail: " + data.email);

        //ocisti polja za unos nakon uspjesnog slanja
        document.getElementById("ime").value = "";
        document.getElementById("prezime").value = "";
        document.getElementById("email").value = "";
        document.getElementById("poruka").value = "";
    })
    .catch(error => {
        //greska u procesu slanja podataka na server
        console.error('Nastao je problem s fetch-om:', error);
    });
}
