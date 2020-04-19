const express = require('express');
const router = express.Router();

const newProfile = require('../controllers/new_profiles');

router.get('/newProfile', newProfile.new);


module.exports = router;