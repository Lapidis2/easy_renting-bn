exports.handleSearch = async (req, res) => {
  const { category, search, district, minPrice, maxPrice, status } = req.query;

  const modelMap = {
    cars: require('../models/carModel'),
    properties: require('../models/propertyModal'),
    assetProperties: require('../models/AssetPropertyModel'),
    clothes: require('../models/clothesModel'),
    lands: require('../models/landModel'),
    supplys: require('../models/supplyPropertyModel'),
    requests: require('../models/requestPropertyModel'),
    motors: require('../models/MotorModel'),
  };

  if (!category || !modelMap[category]) {
    return res.status(400).json({ error: 'Invalid or missing category' });
  }

  try {
    const allItems = await modelMap[category].find({});
    let results = allItems;

    if (search) {
      const searchLower = search.toLowerCase();
      results = results.filter(item =>
        (item.title && item.title.toLowerCase().includes(searchLower)) ||
        (item.location && item.location.toLowerCase().includes(searchLower)) ||
        (item.type && item.type.toLowerCase().includes(searchLower)) ||
        (item.status && item.status.toLowerCase().includes(searchLower)) ||
        (item.area && item.area.toLowerCase().includes(searchLower)) ||
        (item.price && item.price.toString().includes(search))
      );
    }

    if (status) {
      results = results.filter(item =>
        item.status?.toLowerCase() === status.toLowerCase()
      );
    }

    if (district) {
      results = results.filter(item =>
        item.location?.toLowerCase().includes(district.toLowerCase())
      );
    }

    if (minPrice) {
      results = results.filter(item => {
        const priceValue = parseFloat(item.price?.toString().replace(/[^\d.]/g, ''));
        return !isNaN(priceValue) && priceValue >= parseFloat(minPrice);
      });
    }

    if (maxPrice) {
      results = results.filter(item => {
        const priceValue = parseFloat(item.price?.toString().replace(/[^\d.]/g, ''));
        return !isNaN(priceValue) && priceValue <= parseFloat(maxPrice);
      });
    }

    res.json({ success: true, count: results.length, data: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
