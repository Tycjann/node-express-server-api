const express = require('express');

const app = express();

// Middleware: Forms support
app.use(express.urlencoded({ extended: false }));

// Middleware: Receiving data in JSON format
app.use(express.json());

// Endpoint: GET
app.get('/testimonials/:id', (req, res) => {
  res.render('testimonials', { name: req.params.name });
});

// Endpoint: POST
app.post('/testimonials/:id', (req, res) => {
  res.render('testimonials', { name: req.params.name });
});

// Endpoint: PUT
app.put('/testimonials/:id', (req, res) => {
  res.render('testimonials', { name: req.params.name });
});

// Endpoint: not found pages
app.use((req, res) => {
  if (res.status(404)) res.render('404');
})

app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});