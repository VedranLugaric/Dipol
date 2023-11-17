const express = require('express');
const router = express.Router();

//simulacija baze podataka
const users = [];

//POST ruta za registraciju korisnika
router.post('/register', (req, res) => {
  const { ime, prezime, email, lozinka } = req.body;

  //ovdje bi trebali dodati provjeru podataka (npr. je li email vec registriran itd)

  //dodaj korisnika u simuliranu bazu podataka
  users.push({ ime, prezime, email, lozinka });

  //vrati odgovor o uspjesnoj registraciji
  res.json({ message: 'Uspješno ste se registrirali!', user: { ime, prezime, email } });
});

router.get('/users', (req, res) => {
  res.json(users);
});


module.exports = router;
