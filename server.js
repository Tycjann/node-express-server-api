const express = require('express');
const cors = require('cors');

const app = express();

// import routes
const testimonialsRoutes = require('./routes/testimonials.routes');
const concertsRoutes = require('./routes/concerts.routes');
const seatsRoutes = require('./routes/seats.routes');

// ? Greg: Ja to dobrze robię? 
const corsOptions = {
  "origin": "http://localhost:8000/", //origin sets domains that we approve
  "methods": "GET,POST", //we allow only GET and POST methods
}

app.use(cors(corsOptions));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api', testimonialsRoutes); // add post routes to server
app.use('/api', concertsRoutes); // add user routes to server
app.use('/api', seatsRoutes); // add user routes to server

// Endpoint: not found pages
app.use((req, res) => {
  if (res.status(404)) res.json({ message: '404: Page not found!' });
})

app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});