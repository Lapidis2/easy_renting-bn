const cloudinary = require("../Config/cloudinary");
const Property = require("../models/propertyModal");
const moment = require("moment");
const nodemailer = require("nodemailer");
const subscribeModal = require("../models/subscribeModal");

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

    const uploadedImage = req.file  ? req.file : null;
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
      image: imageUrl,
      timeAgo: moment().fromNow(),
    });

    await newProperty.save();

    if (newProperty) {
      const selectEmails = await subscribeModal.find();
      if (selectEmails.length > 0) {
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: process.env.ADMIN_EMAIL,
            pass: process.env.ADMIN_PSWD,
          },
          tls: {
            rejectUnauthorized: false,
          },
        });

        try {
          const emails = selectEmails.map((emailData) => {
            return transporter.sendMail({
              from: process.env.ADMIN_EMAIL,
              to: emailData.email,
              subject: "New property Added",
              html: `
                <div style="font-family: Arial, sans-serif; margin: 0; padding: 10px; background-color: #f4f4f4;">
                  <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                    <h1 style="color: #333;">New property Notification</h1>
                    <img src="${newProperty.image}" alt="Blog Image" style="width: 100%; max-width: 400px; height: auto; margin-bottom: 20px; border-radius: 5px;">
                    <h2 style="font-size: 24px; margin-bottom: 10px;">${newProperty.title}</h2>
                    <p style="color: #666;">Hello there!</p>
                    <p style="color: #666;">We're excited to inform you that a new property has been added to our website.</p>
                    <p style="color: green;">Check it out now:</p>
                    <a href="https://paccy-easy-renting-fn.netlify.app/openedblog?id=${newProperty._id}" style="display: inline-block; padding: 10px 20px; background-color: green; color: white; text-decoration: underline; border-radius: 5px;">See house here</a>
                    <p style="color: #666;">If you have any questions or feedback, feel free to reply to this email.</p>
                    <p style="color: #666;">Thank you for being a valued subscriber!</p>
                    <p style="color: #666;">Best Regards,<br> <span style="color:green">GREATCONNECTION GROUP</span></p>
                  </div>
                </div>
              `,
            });
          });

          await Promise.allSettled(emails);
          await newProperty.save().catch(err => console.error("Save Error:", err));
          return res.status(201).json({ status: 'success', message: 'Notifications sent to all subscribers', newProperty });
        } catch (emailError) {
          console.error("Error sending emails:", emailError);
          return res.status(500).json({ message: 'Error sending notifications to subscribers', error: emailError });
        }
      }
    }

    return res.status(201).json({ status: "success", message: "Property created successfully", newProperty });
  } catch (error) {
    return res.status(400).json({ message: "Error creating property", error: error.message });
  }
};

const getProperties = async (req, res) => {
  try {
    const {
      status,
      location,
      type,
      bedrooms,
      minPrice,
      maxPrice,
      sortBy
    } = req.query;

    const query = {};

    if (status) query.status = status;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (type) query.type = type;
    if (bedrooms) query.bedrooms = bedrooms;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    const sortOption = {};
    if (sortBy) {
      const [field, order] = sortBy.split(":"); // e.g. createdAt:desc
      sortOption[field] = order === "desc" ? -1 : 1;
    }

    const properties = await Property.find(query).sort(sortOption);

    // Update `timeAgo` field if outdated
    for (let i = 0; i < properties.length; i++) {
      const property = properties[i];
      const updatedTimeAgo = moment(property.createdAt).fromNow();
      if (property.timeAgo !== updatedTimeAgo) {
        await Property.findByIdAndUpdate(property._id, { timeAgo: updatedTimeAgo });
      }
    }

    return res.status(200).json(properties);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching properties", error: error.message });
  }
};

const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findByIdAndDelete(id);

    if (!property) {
      return res.status(404).json({ status: "fail", message: "Property not found" });
    }

    return res.status(200).json({ status: "success", message: "Property deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting property", error: error.message });
  }
};


const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Optional: Handle image update if a new one is uploaded
    if (req.file) {
      updates.image = req.file.path;
    }

    const updatedProperty = await Property.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedProperty) {
      return res.status(404).json({ status: "fail", message: "Property not found" });
    }

    return res.status(200).json({ status: "success", message: "Property updated", updatedProperty });
  } catch (error) {
    return res.status(500).json({ message: "Error updating property", error: error.message });
  }
};
const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({ status: "fail", message: "Property not found" });
    }

    return res.status(200).json({ status: "success", property });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching property", error: error.message });
  }
};

const getPropertiesByType = async (req, res) => {
  try {
    const { type } = req.params;

    if (!['House', 'Apartment', 'Hotel'].includes(type)) {
      return res.status(400).json({ status: "fail", message: "Invalid property type" });
    }

    const properties = await Property.find({ type });

    return res.status(200).json({ status: "success", properties });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching properties by type", error: error.message });
  }
};


module.exports = {
  createProperty,
  getProperties,
  deleteProperty,
  updateProperty,
  getPropertyById,
  getPropertiesByType,
};
