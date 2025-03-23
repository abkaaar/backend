const express = require('express');
const router = express.Router();
const book = require('../controllers/BookingController')
const auth = require('../middlewares/AuthMiddleware');



// customer booking routes
router.post('/book', book.createBooking)
router.delete('/book/:id', book.deleteBooking)
router.get('/user/bookings', auth.userVerification, book.getBookings);
router.get('/verify', book.verifyPayment);

// manager booking routes
// router.post('/user/space/add', auth.userVerification, upload.single('image'), space.addSpace)
// router.put('/user/space/edit/:id', auth.userVerification,upload.single('image'), space.editSpace)
// router.get('/user/space/:id', space.getSpace);
// router.delete('/user/spaces/:id', space.deleteSpace)
// router.get('/user/spaces', auth.userVerification, space.getUserSpaces);


module.exports = router;