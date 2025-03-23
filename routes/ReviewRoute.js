const express = require('express');
const router = express.Router();
const review = require('../controllers/ReviewController')
const auth = require('../middlewares/AuthMiddleware');



// customer review routes
router.post('/add', auth.userVerification ,review.addReview)



module.exports = router;