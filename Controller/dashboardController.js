// controllers/dashboardController.js
const Property = require("../models/propertyModal");
const RequestProperty = require("../models/requestPropertyModel");
const SupplyProperty = require("../models/supplyPropertyModel");
const User = require("../models/userModel");
const AssetProperty = require("../models/AssetPropertyModel")

exports.getDashboardStats = async (req, res) => {
  try {
    const totalProperties = await Property.countDocuments();
    const activeRentals = await Property.countDocuments({ status: "Rent" });
    const registeredUsers = await User.countDocuments();
    const requestedProperties = await RequestProperty.countDocuments();
    const suppliedProperties = await SupplyProperty.countDocuments();
    const pendingApprovals = await SupplyProperty.countDocuments({ status: "pending" });
    const  totalAssetProperties = await  AssetProperty.countDocuments();

    res.json({
      totalProperties,
      totalAssetProperties,
      activeRentals,
      registeredUsers,
      requestedProperties,
      suppliedProperties,
      pendingApprovals,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ error: "Server Error" });
  }
};


