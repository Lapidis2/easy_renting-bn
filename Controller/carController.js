const CarListing = require('../models/carModel');
const cloudinary = require('cloudinary').v2; // If using Cloudinary

// Create New Car Listing
exports.createCarListing = async (req, res) => {
  try {
    // Process image upload
    const imageData = req.file ? {
      public_id: req.file.filename,
      secure_url: req.file.path
    } : null;

    const newCar = new CarListing({
      ...req.body,
      image: imageData
    });

    const savedCar = await newCar.save();
    
    res.status(201).json({
      success: true,
      data: savedCar
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get All Car Listings
exports.getAllCarListings = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filtering
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.fuel) filter.fuel = req.query.fuel;

    const [cars, total] = await Promise.all([
      CarListing.find(filter).skip(skip).limit(limit),
      CarListing.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      count: cars.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: cars
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Single Car Listing
exports.getCarListing = async (req, res) => {
  try {
    const car = await CarListing.findById(req.params.id);
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }
    res.status(200).json({
      success: true,
      data: car
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update Car Listing
exports.updateCarListing = async (req, res) => {
  try {
    const updatedData = { ...req.body };
    
    if (req.file) {
      updatedData.image = {
        public_id: req.file.filename,
        secure_url: req.file.path
      };
    }

    const updatedCar = await CarListing.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );

    if (!updatedCar) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    res.status(200).json({
      success: true,
      data: updatedCar
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete Car Listing
exports.deleteCarListing = async (req, res) => {
  try {
    const car = await CarListing.findByIdAndDelete(req.params.id);
    
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    // Optional: Delete image from Cloudinary
    if (car.image.public_id) {
      await cloudinary.uploader.destroy(car.image.public_id);
    }

    res.status(200).json({
      success: true,
      message: 'Car deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};