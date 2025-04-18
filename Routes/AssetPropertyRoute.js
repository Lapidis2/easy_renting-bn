const express = require('express');
const router = express.Router();
const AssetController = require('../Controller/AssetPropertyController');
const upload = require('../Config/multer');

router.post('/',upload.single("image"), AssetController.createAsset);

router.get('/', AssetController.getAllAssets);

router.get('/:id', AssetController.getAssetById);

router.put('/:id',upload.single("image"), AssetController.updateAsset);

router.delete('/:id', AssetController.deleteAsset);
router.get('/type/:type', AssetController.getAssetsByType);

module.exports = router;
