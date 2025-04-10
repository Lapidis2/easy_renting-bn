const RequestProperty = require("../models/requestPropertyModel");

exports.createRequestProperty = async (req, res) => {
  try {

    const { title, price, location, ...rest } = req.body;

    if (!req.body.title || !req.body.price || !req.body.location) {
      return res.status(400).json({
        success: false,
        message: "Title, price, and location are required fields",
      });
    }

    const imagePath = req.file ? req.file.path : null;

    const newRequest = new RequestProperty({
      title,
      price,
      location,
      image: imagePath,
      ...rest,
      createdAt: new Date().toDateString(),
      updatedAt: new Date().toDateString(),
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
}

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
      const searchRegex = new RegExp(req.query.search, 'i');
      searchQuery = {
        $or: [
          { title: { $regex: searchRegex } },
          { location: { $regex: searchRegex } },
        ],
      };
    }

    const finalQuery = {
      ...queryObj,
      ...searchQuery,
    };

    // Sorting logic
    let sortBy = { createdAt: -1 };
    if (req.query.sort) {
      const sortFields = req.query.sort.split(',').join(' ');
      sortBy = sortFields;
    }

    const [requests, total] = await Promise.all([
      RequestProperty.find(finalQuery).sort(sortBy).skip(skip).limit(limit),
      RequestProperty.countDocuments(finalQuery),
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

exports.getSingleRequest = async (req, res) => {
  try {
    const request = await RequestProperty.findById(req.params.id);

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
    if (error.name === 'CastError') {
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

exports.updateRequest = async (req, res) => {
  try {
    const updateData = { ...req.body, updatedAt: new Date() };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const updatedRequest = await RequestProperty.findByIdAndUpdate(
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
    if (error.name === 'ValidationError') {
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

exports.deleteRequest = async (req, res) => {
  try {
    const deletedRequest = await RequestProperty.findByIdAndDelete(req.params.id);

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
