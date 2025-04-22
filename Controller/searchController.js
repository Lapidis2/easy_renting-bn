exports.handleSearch = async (req, res) => {
  const { category, search, district, minPrice, maxPrice, status, type } = req.query;

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

    // Search by any matching content
    if (search) {
      const searchLower = search.toLowerCase();
      results = results.filter(item =>
        item.title?.toLowerCase().includes(searchLower) ||
        item.location?.toLowerCase().includes(searchLower) ||
        item.area?.toLowerCase().includes(searchLower) ||
        item.status?.toLowerCase().includes(searchLower) ||
        item.type?.toLowerCase().includes(searchLower) ||
        item.price?.toString().includes(search)
      );
    }

    // Exact filter by status
    if (status) {
      const statusLower = status.toLowerCase();
      results = results.filter(item =>
        item.status?.toLowerCase() === statusLower
      );
    }

    // Exact filter by type (new addition)
    if (type) {
      const typeLower = type.toLowerCase();
      results = results.filter(item =>
        item.type?.toLowerCase() === typeLower
      );
    }

    // Filter by district/location
    if (district) {
      const districtLower = district.toLowerCase();
      results = results.filter(item =>
        item.location?.toLowerCase().includes(districtLower)
      );
    }

    // Min price
    if (minPrice) {
      results = results.filter(item => {
        const price = parseFloat(item.price?.toString().replace(/[^\d.]/g, ''));
        return !isNaN(price) && price >= parseFloat(minPrice);
      });
    }

    // Max price
    if (maxPrice) {
      results = results.filter(item => {
        const price = parseFloat(item.price?.toString().replace(/[^\d.]/g, ''));
        return !isNaN(price) && price <= parseFloat(maxPrice);
      });
    }
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: "No results found" });
    }

    res.json({ success: true, count: results.length, data: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
