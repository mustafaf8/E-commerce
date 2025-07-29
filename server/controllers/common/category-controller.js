const Category = require("../../models/Category");

// Kategorileri hiyerarşik yapıda döndürmek için yardımcı fonksiyon
const buildCategoryTree = (categories, parentId = null) => {
  const tree = [];
  
  for (const category of categories) {
    // parent null ise ana kategori, değilse alt kategori
    const categoryParentId = category.parent ? category.parent._id || category.parent : null;
    
    if (categoryParentId?.toString() === parentId?.toString()) {
      const children = buildCategoryTree(categories, category._id);
      const categoryWithChildren = {
        ...category.toObject(),
        children: children
      };
      tree.push(categoryWithChildren);
    }
  }
  
  return tree;
};

const getActiveCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .populate('parent', 'name slug')
      .sort({ name: 1 });
    
    // Hiyerarşik yapıyı oluştur
    const categoryTree = buildCategoryTree(categories);
    
    res.status(200).json({ success: true, data: categoryTree });
  } catch (error) {
   // console.error("Aktif kategorileri getirme hatası:", error);
    res.status(500).json({ success: false, message: "Sunucu hatası oluştu." });
  }
};

module.exports = {
  getActiveCategories,
};
