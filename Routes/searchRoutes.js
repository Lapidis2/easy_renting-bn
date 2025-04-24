const express = require('express');
const router = express.Router();
const { handleSearch } = require('../Controller/searchController');

router.get('/search', handleSearch);
module.exports = router;
