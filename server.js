const express = require('express');
const cors = require('cors');
const path = require('path');
const socket = require('socket.io');

const app = express();

app.use((req, res, next) => {
  req.io = io;
  next();
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '/client/build')));

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port: 8000');
});

// Websocket
// const io = socket(server);
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000"
    // origin: ['http://localhost:*', 'http://anotherdomain.com:*'],
  }
});

io.on('connection', (socket) => {
  console.log('Connect - new socket!');
});



// import routes
const testimonialsRoutes = require('./routes/testimonials.routes');
const concertsRoutes = require('./routes/concerts.routes');
const seatsRoutes = require('./routes/seats.routes');

// ? Greg: Ja to dobrze robię? 
const corsOptions = {
  "origin": "http://localhost:3000", //origin sets domains that we approve
  "methods": "GET,POST", //we allow only GET and POST methods
}

app.use(cors(corsOptions));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api', testimonialsRoutes); // add testimonials routes to server
app.use('/api', concertsRoutes); // add concerts routes to server
app.use('/api', seatsRoutes); // add seats routes to server

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

// Endpoint: not found pages
app.use((req, res) => {
  if (res.status(404)) res.json({ message: '404: Page not found!' });
})