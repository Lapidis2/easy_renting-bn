const express = require('express');
const router = express.Router();
const upload = require('../Config/multer');
const {
  createClothes,
  getAllClothes,
  getClothesById,
  updateClothes,
  deleteClothes
} = require('../Controller/clothesController');

router.post('/clothes', upload.single('image'), createClothes);
router.get('/clothes', getAllClothes);
router.get('/clothes/:id', getClothesById);
router.put('/clothes/:id', upload.single('image'), updateClothes);
router.delete('/clothes/:id', deleteClothes);

module.exports = router;
