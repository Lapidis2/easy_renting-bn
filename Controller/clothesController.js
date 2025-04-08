const Clothes = require('../models/clothesModel'); // Make sure the model path is correct

// Create a clothing item
exports.createClothes = async (req, res) => {
  try {
    const image = req.file ? req.file.path : null;
    const clothesData = {
      ...req.body,
      image: image || undefined
    };

    const newClothes = new Clothes(clothesData);
    const savedClothes = await newClothes.save();

    res.status(201).json({ success: true, data: savedClothes });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all clothes
exports.getAllClothes = async (req, res) => {
  try {
    const clothes = await Clothes.find();
    res.status(200).json({ success: true, data: clothes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get one clothing item by ID
exports.getClothesById = async (req, res) => {
  try {
    const clothes = await Clothes.findById(req.params.id);
    if (!clothes) {
      return res.status(404).json({ success: false, message: 'Clothing not found' });
    }
    res.status(200).json({ success: true, data: clothes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update clothing item
exports.updateClothes = async (req, res) => {
  try {
    if (req.file) {
      req.body.image = req.file.path;
    }

    const updated = await Clothes.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Clothing not found' });
    }

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete clothing item
exports.deleteClothes = async (req, res) => {
  try {
    const deleted = await Clothes.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Clothing not found' });
    }
    res.status(200).json({ success: true, message: 'Clothing deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
