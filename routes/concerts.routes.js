const express = require('express');
const router = express.Router();
const ConcertController = require('../controllers/concerts.controller');

router.get('/concerts', ConcertController.getAll);
router.get('/concerts/random', ConcertController.getRandom);
router.get('/concerts/:id', ConcertController.getById);
router.post('/concerts', ConcertController.addOne);
router.put('/concerts/:id', ConcertController.updateById);
router.delete('/concerts/:id', ConcertController.deleteById);

// more concerts
router.get('/concerts/performer/:performer', ConcertController.getByPerformer);
router.get('/concerts/genre/:genre', ConcertController.getByGenre);
router.get('/concerts/day/:day', ConcertController.getByDay);
router.get('/concerts/price/:price_min/:price_max', ConcertController.getPriceMinMax);

// free seats on concert
router.get('/concerts/seats/:day', ConcertController.getFreeSeats);

module.exports = router;