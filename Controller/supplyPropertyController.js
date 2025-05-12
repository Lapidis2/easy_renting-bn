const SupplyProperty = require("../models/supplyPropertyModel");

// CREATE
exports.createSupplyProperty = async (req, res) => {
  try {
    const { title, price, location, ...rest } = req.body;

    if (!title || !price || !location) {
      return res.status(400).json({
        success: false,
        message: "Title, price, and location are required fields",
      });
    }

    const imageData = req.file ? req.file.path : null;

    const newRequest = new SupplyProperty({
      title,
      price,
      location,
      image: imageData,
      ...rest,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedRequest = await newRequest.save();

    res.status(201).json({
      success: true,
      data: savedRequest,
      message: "Supply property created successfully",
    });
  } catch (error) {
    console.error("Error creating supply property:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error while creating supply property",
    });
  }
};
// GET ALL with Search, Sort, Filter, Pagination
exports.getAllRequest = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const queryObj = { ...req.query };
    const excludedFields = ['page', 'limit', 'sort', 'search'];
    excludedFields.forEach((field) => delete queryObj[field]);

    // Search logic
    let searchQuery = {};
    if (req.query.search) {
      const regex = new RegExp(req.query.search, 'i');
      searchQuery = {
        $or: [
          { title: { $regex: regex } },
          { location: { $regex: regex } },
        ],
      };
    }

    const finalQuery = {
      ...queryObj,
      ...searchQuery,
    };

    // Sorting
    let sortBy = { createdAt: -1 };
    if (req.query.sort) {
      sortBy = req.query.sort.split(',').join(' ');
    }

    const [requests, total] = await Promise.all([
      SupplyProperty.find(finalQuery).sort(sortBy).skip(skip).limit(limit),
      SupplyProperty.countDocuments(finalQuery),
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
      message: error.message || "Failed to fetch supply properties",
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
        message: "Supply property not found",
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
        message: "Invalid ID format",
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch supply property",
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
        message: "Supply property not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedRequest,
      message: "Supply property updated successfully",
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
      message: error.message || "Failed to update supply property",
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
        message: "Supply property not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Supply property deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete supply property",
    });
  }
};
// APPROVE
exports.approveRequest = async (req, res) => {
  try {
    const property = await SupplyProperty.findByIdAndUpdate(
      req.params.id,
      { status: "Rent", updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Supply property not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Property approved successfully",
      data: property,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to approve supply property",
    });
  }
};

