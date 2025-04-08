const RequestProperty = require("../models/requestPropertyModel");

exports.createRequestProperty = async (req, res) => {
  try {
    if (!req.body.title || !req.body.price || !req.body.location) {
      return res.status(400).json({
        success: false,
        message: "Title, price, and location are required fields"
      });
    }

    // Process image if uploaded
    const imageData = req.file ? {
      public_id: req.file.filename,
      secure_url: req.file.path,
      uploadedAt: new Date()
    } : null;

    // Create new request
    const newRequest = new RequestProperty({
      ...req.body,
      image: imageData,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Save to database
    const savedRequest = await newRequest.save();
    
    res.status(201).json({
      success: true,
      data: savedRequest,
      message: "Property request created successfully"
    });

  } catch (error) {
    console.error("Error creating property request:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error while creating request"
    });
  }
};

// Get all property requests (with pagination)
exports.getAllRequest = async (req, res) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [requests, total] = await Promise.all([
      RequestProperty.find().skip(skip).limit(limit),
      RequestProperty.countDocuments()
    ]);

    res.status(200).json({
      success: true,
      count: requests.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: requests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch requests"
    });
  }
};

// Get single property request
exports.getSingleRequest = async (req, res) => {
  try {
    const request = await RequestProperty.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found"
      });
    }
    
    res.status(200).json({
      success: true,
      data: request
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "Invalid request ID format"
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch request"
    });
  }
};

// Update property request
exports.updateRequest = async (req, res) => {
  try {
    // Process image update if new file uploaded
    const updateData = { ...req.body, updatedAt: new Date() };
    if (req.file) {
      updateData.image = {
        public_id: req.file.filename,
        secure_url: req.file.path,
        updatedAt: new Date()
      };
    }

    const updatedRequest = await RequestProperty.findByIdAndUpdate(
      req.params.id,
      updateData,
      { 
        new: true,
        runValidators: true 
      }
    );

    if (!updatedRequest) {
      return res.status(404).json({
        success: false,
        message: "Request not found"
      });
    }

    res.status(200).json({
      success: true,
      data: updatedRequest,
      message: "Request updated successfully"
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update request"
    });
  }
};

exports.deleteRequest = async (req, res) => {
  try {
    const deletedRequest = await RequestProperty.findByIdAndDelete(req.params.id);

    if (!deletedRequest) {
      return res.status(404).json({
        success: false,
        message: "Request not found"
      });
    }
    res.status(200).json({
      success: true,
      message: "Request deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete request"
    });
  }
};