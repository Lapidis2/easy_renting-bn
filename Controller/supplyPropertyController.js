const SupplyProperty = require("../models/supplyPropertyModel");

// CREATE
exports.createSupplyProperty = async (req, res) => {
  try {
    if (!req.body.title || !req.body.price || !req.body.location) {
      return res.status(400).json({
        success: false,
        message: "Title, price, and location are required fields",
      });
    }

    const imageData = req.file ? req.file.path : null;

    const newRequest = new SupplyProperty({
      ...req.body,
      image: imageData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedRequest = await newRequest.save();

    res.status(201).json({
      success: true,
      data: savedRequest,
      message: "Property request created successfully",
    });
  } catch (error) {
    console.error("Error creating property request:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error while creating request",
    });
  }
};

// GET ALL
exports.getAllRequest = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [requests, total] = await Promise.all([
      SupplyProperty.find().skip(skip).limit(limit),
      SupplyProperty.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      count: requests.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: requests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch requests",
    });
  }
};

// GET ONE
exports.getSingleRequest = async (req, res) => {
  try {
    const request = await SupplyProperty.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid request ID format",
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch request",
    });
  }
};

// UPDATE
exports.updateRequest = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      updatedAt: new Date(),
    };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const updatedRequest = await SupplyProperty.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedRequest) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedRequest,
      message: "Request updated successfully",
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "Failed to update request",
    });
  }
};

// DELETE
exports.deleteRequest = async (req, res) => {
  try {
    const deletedRequest = await SupplyProperty.findByIdAndDelete(req.params.id);

    if (!deletedRequest) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Request deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete request",
    });
  }
};
