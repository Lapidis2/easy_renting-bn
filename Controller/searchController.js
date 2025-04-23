const AssetProperty = require('../models/AssetPropertyModel');
const Property = require('../models/propertyModal');

exports.handleSearch =  async (req, res) => {
  const query = req.query.q;

  try {
    if (!query || query.trim() === "") {
      const [assets, properties] = await Promise.all([
        AssetProperty.find(),
        Property.find()
      ]);

      return res.json({ assets, properties });
    }

    const [assets, properties] = await Promise.all([
      AssetProperty.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { type: { $regex: query, $options: 'i' } },
          { location: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } }
        ]
      }),
      Property.find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { type: { $regex: query, $options: 'i' } },
          { location: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } }
        ]
      })
    ]);

    res.json({ assets, properties });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
