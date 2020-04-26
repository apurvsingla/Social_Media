const express = require('express');
const router = express.Router();

const homeController = require('../controllers/home_controller')
console.log('Testing routes');

router.get('/', homeController.home);
router.use('/users', require('./users'));
router.use('/users', require('./new'));
router.use('/posts', require('./posts'));

module.exports = router;