const express = require('express');
const router = express.Router();
const landController = require('../Controller/landController');
const upload = require('../Config/multer'); 
router.post('/lands',upload.single("image"), landController.createLandListing);
router.get('/lands', landController.getAllLandListings);
router.get('/lands/:id', landController.getLandListing);
router.put('/lands/:id',upload.single("image"), landController.updateLandListing);
router.delete('/lands/:id', landController.deleteLandListing);

module.exports = router;
