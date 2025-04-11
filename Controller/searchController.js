const dataSources = {
  cars: await require('../models/carModel').find({}),
  properties: await require('../models/propertyModal').find({}),
  clothes: await require('../models/clothesModel').find({}),
  lands: await require('../models/landModel').find({}),
  supplys: await require('../models/supplyPropertyModel').find({}),
  requests: await require('../models/requestPropertyModel').find({}),
    motors: await require('../models/MotorModel').find({}), 
};
exports.handleSearch = (req, res) => {
  const { category, search, district, minPrice, maxPrice } = req.query;

  if (!category || !dataSources[category]) {
    return res.status(400).json({ error: 'Invalid or missing category' });
  }
  let results = dataSources[category];
  if (search) {
    const searchLower = search.toLowerCase();
    results = results.filter(item =>
      item.title?.toLowerCase().includes(searchLower) ||
      item.area?.toLowerCase().includes(searchLower) ||
      item.price?.toString().includes(search)
    );
  }
  if (district) {
    results = results.filter(item =>
      item.location?.toLowerCase().includes(district.toLowerCase())
    );
  }
  if (minPrice) {
    results = results.filter(item => item.price >= parseFloat(minPrice));
  }
  if (maxPrice) {
    results = results.filter(item => item.price <= parseFloat(maxPrice));
  }
  res.json({ success: true, count: results.length, data: results });
};