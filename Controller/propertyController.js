const cloudinary = require("../config/cloudinary");
const Property = require("../models/propertyModal");
const moment = require("moment");


const createProperty = async (req, res) => {
  try {
    const { 
      title, 
      price, 
      status, 
      location, 
      owner, 
      contact, 
      description, 
      bedrooms, 
      bathrooms, 
      toilets, 
      area, 
      type, 
      features 
    } = req.body;

    const uploadedImage = req.file;
    if (!uploadedImage) {
      return res.status(400).json({ message: "Image upload failed" });
    }

    const imageUrl = uploadedImage.path;  
    const newProperty = new Property({
      title,
      price,
      status,
      location,
      owner,
      contact,
      description,
      bedrooms,
      bathrooms,
      toilets,
      area,
      type,
      features,
      image: imageUrl
    });

    await newProperty.save();
    

  } catch (error) {
    res.status(400).json({ message: "Error creating property", error: error.message });
  }
};

const getProperties = async (req, res) => {
  try {
    const properties = await Property.find();

    const propertiesWithTimeAgo = properties.map(property => {
      const timeAgo = moment(property.createdAt).fromNow();
      return { ...property.toObject(), timeAgo };
    });

    res.status(200).json(propertiesWithTimeAgo);
  } catch (error) {
    res.status(500).json({ message: "Error fetching properties", error: error.message });
  }
};

module.exports = { createProperty, getProperties };
