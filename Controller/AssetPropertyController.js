const AssetProperty = require('../models/AssetPropertyModel');

// @desc Create a new asset
exports.createAsset = async (req, res) => {
    try {
      const assetData = {
        ...req.body,
        image: req.file ? req.file.path : null, 
      };
  
      const asset = await AssetProperty.create(assetData);
      res.status(201).json(asset);
    } catch (error) {
      console.error("Asset creation error:", error.message);
      res.status(400).json({ error: error.message });
    }
  };

exports.getAllAssets = async (req, res) => {
    try {
      const {
        type,
        minPrice,
        maxPrice,
        status,
        transmission,
        fuel,
        certified,
        name,
        image,
        location,
        sort,
        page = 1,
        limit = 10
      } = req.query;
  
      // Build the filter object
      const filter = {};
  
      if (type) filter.type = type;
      if (location) filter.location = location;
      if (image) filter.image = image;
      if (status) filter.status = status;
      if (transmission) filter.transmission = transmission;
      if (fuel) filter.fuel = fuel;
      if (certified !== undefined) filter.certified = certified === 'true';
  
      if (name) {
        filter.name = { $regex: name, $options: 'i' }; // Case-insensitive name search
      }
  
      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
      }
  
      // Query builder
      let query = AssetProperty.find(filter);
  
      // Sorting
      if (sort) {
        const sortBy = sort.split(',').join(' ');
        query = query.sort(sortBy); // e.g., ?sort=price,-createdAt
      } else {
        query = query.sort('-createdAt'); // default sort
      }
  
      // Pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);
      query = query.skip(skip).limit(parseInt(limit));
  
      // Execute query
      const assets = await query;
      const total = await AssetProperty.countDocuments(filter);
  
      res.status(200).json({
        success: true,
        count: assets.length,
        total,
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        data: assets
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  exports.getAssetsByType = async (req, res) => {
    try {
      const requestedType = req.params.type;
      const validTypes = ['Car', 'Motorcycle', 'Land', 'Clothes', 'Other'];
  
      // Capitalize first letter to match enum format
      const type = requestedType.charAt(0).toUpperCase() + requestedType.slice(1).toLowerCase();
  
      if (!validTypes.includes(type)) {
        return res.status(400).json({ error: 'Invalid asset type' });
      }
  
      const assets = await AssetProperty.find({ type });
  
      if (!assets.length) {
        return res.status(404).json({ message: `No assets found for type: ${type}` });
      }
  
      res.status(200).json(assets);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

// @desc Get a single asset by ID
exports.getAssetById = async (req, res) => {
  try {
    const asset = await AssetProperty.findById(req.params.id);
    if (!asset) return res.status(404).json({ error: 'Asset not found' });
    res.status(200).json(asset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc Update an asset
exports.updateAsset = async (req, res) => {
  try {
    const assetData = {
      ...req.body,
      image: req.file ? req.file.path : undefined, // Use the new image if provided
    };
    const updatedAsset = await AssetProperty.findByIdAndUpdate(
      req.params.id,
      assetData,
      { new: true, runValidators: true }
    );
    if (!updatedAsset) return res.status(404).json({ error: 'Asset not found' });
    res.status(200).json(updatedAsset);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc Delete an asset
exports.deleteAsset = async (req, res) => {
  try {
    const deletedAsset = await AssetProperty.findByIdAndDelete(req.params.id);
    if (!deletedAsset) return res.status(404).json({ error: 'Asset not found' });
    res.status(200).json({ message: 'Asset deleted successfully',deletedAsset });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
