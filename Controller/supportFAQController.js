// controllers/supportFAQController.js
const Support = require('../models/Support');
const FAQ = require('../models/FAQ');

// Get all support information
exports.getSupportInfo = async (req, res) => {
  try {
    const support = await Support.findOne();
    res.status(200).json(support);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching support info', error });
  }
};

// Update support information
exports.updateSupportInfo = async (req, res) => {
  try {
    const { contactEmail, supportPhone, userGuideURL, termsURL } = req.body;
    const support = await Support.findOneAndUpdate(
      {},
      { contactEmail, supportPhone, userGuideURL, termsURL },
      { new: true }
    );
    res.status(200).json(support);
  } catch (error) {
    res.status(500).json({ message: 'Error updating support info', error });
  }
};

// Get all FAQs
exports.getFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find();
    res.status(200).json(faqs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching FAQs', error });
  }
};

// Add a new FAQ
exports.addFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const newFAQ = new FAQ({ question, answer });
    await newFAQ.save();
    res.status(201).json(newFAQ);
  } catch (error) {
    res.status(500).json({ message: 'Error adding FAQ', error });
  }
};

// Delete a FAQ by ID
exports.deleteFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    await FAQ.findByIdAndDelete(id);
    res.status(200).json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting FAQ', error });
  }
};
