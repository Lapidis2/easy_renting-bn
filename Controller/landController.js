const Land = require('../models/landModel');
exports.createLandListing = async (req, res) => {
  try {
    const newLand = new Land({
      ...req.body 
    });

    const image = req.file ? req.file.path : null;
    if (image) {
        newLand.image = image; 
        }

    const savedLand = await newLand.save();
    
    res.status(201).json({
      success: true,
      savedLand
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
exports.getAllLandListings = async (req, res) => {
  try {
    const lands = await Land.find();
    res.status(200).json({
      success: true,
      data: lands
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
exports.getLandListing = async (req, res) => {
  try {
    const land = await Land.findById(req.params.id);
    if (!land) {
      return res.status(404).json({
        success: false,
        message: 'Land not found'
      });
    }
    res.status(200).json({
      success: true,
      data: land
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
exports.updateLandListing = async (req, res) => {
  try {
    const updatedLand = await Land.findByIdAndUpdate(
      req.params.id,
      req.body, 
      { new: true, runValidators: true }
    );

    if (!updatedLand) {
      return res.status(404).json({
        success: false,
        message: 'Land not found'
      });
    }

    res.status(200).json({
      success: true,
      data: updatedLand
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
exports.deleteLandListing = async (req, res) => {
  try {
    const land = await Land.findByIdAndDelete(req.params.id);
    
    if (!land) {
      return res.status(404).json({
        success: false,
        message: 'Land not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Land listing deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};