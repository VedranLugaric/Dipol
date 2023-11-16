const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/live', (req, res) => {
  res.render('live');
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.get('/login', (req, res) => {
  res.render('login');
});

const registrationRoutes = require('./routes/registration-route');
app.use(registrationRoutes);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
