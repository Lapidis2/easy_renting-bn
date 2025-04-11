exports.handleSearch = async (req, res) => {
    const { category, search, district, minPrice, maxPrice } = req.query;
  
    // Define mapping between category name and its model
    const modelMap = {
      cars: require('../models/carModel'),
      properties: require('../models/propertyModal'),
      clothes: require('../models/clothesModel'),
      lands: require('../models/landModel'),
      supplys: require('../models/supplyPropertyModel'),
      requests: require('../models/requestPropertyModel'),
      motors: require('../models/MotorModel'),
    };
  
    // Check if category is valid
    if (!category || !modelMap[category]) {
      return res.status(400).json({ error: 'Invalid or missing category' });
    }
  
    try {
      // Fetch all items for the selected category
      const allItems = await modelMap[category].find({});
  
      let results = allItems;
  
      // Keyword search: title, area, price (string includes)
      if (search) {
        const searchLower = search.toLowerCase();
        results = results.filter(item =>
          item.title?.toLowerCase().includes(searchLower) ||
          item.area?.toLowerCase().includes(searchLower) ||
          item.price?.toString().includes(search)
        );
      }
  
      // Filter by district
      if (district) {
        results = results.filter(item =>
          item.location?.toLowerCase().includes(district.toLowerCase())
        );
      }
  
      // Filter by min price
      if (minPrice) {
        results = results.filter(item => {
          const priceValue = parseFloat(item.price?.toString().replace(/[^\d.]/g, ''));
          return !isNaN(priceValue) && priceValue >= parseFloat(minPrice);
        });
      }
  
      // Filter by max price
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
  