const cloudinary = require("../config/cloudinary");
const Property = require("../models/propertyModal");
const moment = require("moment");
const subscribeModal =require("../models/subscribeModal")
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
              subject: "New Challenge Added",
              html: `
                <div style="font-family: Arial, sans-serif; margin: 0; padding: 10px; background-color: #f4f4f4;">
                  <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                    <h1 style="color: #333;">New property Notification</h1>
                    <img src="${newProperty.imageUrl}" alt="Blog Image" style="width: 100%; max-width: 400px; height: auto; margin-bottom: 20px; border-radius: 5px;">
                    <h2 style="font-size: 24px; margin-bottom: 10px;">${newProperty.title}</h2>
                    <p style="color: #666;">Hello there!</p>
                    <p style="color: #666;">We're excited to inform you that a new challenge post has been added to our website.</p>
                    <p style="color: #666;">Check it out now:</p>
                    <a href="https://umurava-skill-challenge.netlify.app//openedblog?id=${newProperty._id}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">See house here</a>
                    <p style="color: #666;">If you have any questions or feedback, feel free to reply to this email.</p>
                    <p style="color: #666;">Thank you for being a valued subscriber!</p>
                    <p style="color: #666;">Best Regards,<br>GREAT CONNECTION GROUP</p>
                  </div>
                </div>
              `,
            });
          });

          await Promise.all(emails);
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
}};

const getProperties = async (req, res) => {
	try {
	  const properties = await Property.find();
  	  properties.forEach(async (property) => {
		const updatedTimeAgo = moment(property.createdAt).fromNow();
		if (property.timeAgo !== updatedTimeAgo) {
		  await Property.findByIdAndUpdate(property._id, { timeAgo: updatedTimeAgo });
		}
	  });
  
	 return  res.status(200).json(properties); 
	} catch (error) {
	 return res.status(500).json({ message: "Error fetching properties", error: error.message });
	}
  };
  

module.exports = { createProperty, getProperties };
