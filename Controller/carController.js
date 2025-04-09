const CarListing = require('../models/carModel');
const cloudinary = require('cloudinary').v2;

exports.createCarListing = async (req, res) => {
  try {
    const imageData = req.file ? req.file : null;

    const newCar = new CarListing({
      ...req.body,
      image: imageData ? imageData.path : null // Store only the URL (or path) of the image
    });

    const savedCar = await newCar.save();
    
    res.status(201).json({
      success: true,
      savedCar
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getAllCarListings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

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

exports.updateCarListing = async (req, res) => {
  try {
    const updatedData = { ...req.body };
    
    if (req.file) {
      updatedData.image = req.file.path; // Store only the image URL (or path)
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
    if (car.image) {
      const publicId = car.image.split('/').pop().split('.').shift(); // Assuming the URL is in the format of Cloudinary URL
      await cloudinary.uploader.destroy(publicId); // Delete image from Cloudinary
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
