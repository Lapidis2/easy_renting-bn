// controllers/motorController.js
const Motor = require("../models/Motor");

// @desc    Get all motors
exports.getAllMotors = async (req, res) => {
  try {
    const motors = await Motor.find({});
    res.json({ success: true, data: motors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get a single motor by ID
exports.getMotorById = async (req, res) => {
  try {
    const motor = await Motor.findById(req.params.id);
    if (!motor) {
      return res.status(404).json({ success: false, message: "Motor not found" });
    }
    res.json({ success: true, data: motor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Search motors with filters
exports.searchMotors = async (req, res) => {
  try {
    const { search, fuel, transmission, status, type } = req.query;
    let query = {};

    if (search) query.name = { $regex: search, $options: "i" };
    if (fuel) query.fuel = fuel;
    if (transmission) query.transmission = transmission;
    if (status) query.status = status;
    if (type) query.type = type;

    const results = await Motor.find(query);
    res.json({ success: true, count: results.length, data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Add a new motor
exports.addMotor = async (req, res) => {
  try {
    const newMotor = new Motor(req.body);
    const saved = await newMotor.save();
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update an existing motor
exports.updateMotor = async (req, res) => {
  try {
    const updated = await Motor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ success: false, message: "Motor not found" });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Delete a motor
exports.deleteMotor = async (req, res) => {
  try {
    const deleted = await Motor.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Motor not found" });
    }
    res.json({ success: true, message: "Motor deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
