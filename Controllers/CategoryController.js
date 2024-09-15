const { isValidObjectId, default: mongoose } = require("mongoose");
const CategoryModel = require("../Models/CategoryMode");
const DishModel = require("../Models/DishModel");

const CategoryController = {
  // Get All Categories
  GetCategories: async (req, res) => {
    const { restaurant } = req.params;
    try {
      if (isValidObjectId(restaurant)) {
        // const categories = await CategoryModel.find({ restaurant: restaurant });
        const categories = await CategoryModel.aggregate([
          {
            $match: {
              restaurant: new mongoose.Types.ObjectId(restaurant),
            },
          },
          {
            $project: {
              __v: 0,
            },
          },
        ]);
        // --------------------------------------------------
        if (categories.length != 0) return res.status(200).json(categories);
        return res.status(400).json({ msg: "No Category Found" });
      }
      return res.status(400).json({ msg: "Invalid ID" });
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Something Went Wrong!", error: error });
    }
  },
  // GetCategories: async (req, res) => {
  //   const { restaurant } = req.params;
  //   try {
  //     if (isValidObjectId(restaurant)) {
  //       const categories = await CategoryModel.find({ restaurant: restaurant });
  //       if (categories.length != 0) return res.status(200).json(categories);
  //       return res.status(400).json({ msg: "No Category Found" });
  //     }
  //     return res.status(400).json({ msg: "Invalid ID" });
  //   } catch (error) {
  //     return res
  //       .status(500)
  //       .json({ msg: "Something Went Wrong!", error: error });
  //   }
  // },
  // Get Category
  GetCategory: async (req, res) => {
    const { restaurant, category } = req.params;
    try {
      if (isValidObjectId(category)) {
        const [cate] = await CategoryModel.find({
          _id: category,
          restaurant: restaurant,
        });
        console.log(cate);
        if (cate) return res.status(200).json(cate);
        // If Not Found
        return res.status(400).json({ msg: "Not Found" });
      }
      return res.status(400).json({ msg: "Invalid Category" });
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Something Went Wrong!", error: error });
    }
  },
  // Create New Category
  CreateNewCategory: async (req, res) => {
    const { name, restaurant, active } = req.body;
    console.log(name, restaurant, active);
    try {
      // Check If This Category Is Already Exist Or Not
      const [category] = await CategoryModel.find({
        name: name.en,
        restaurant: restaurant,
      });
      // If It's Exist => Return Error
      if (category)
        return res.status(400).json({ msg: "This Category Is Already Exist!" });
      // If Not => Create New Category
      const newCategory = await CategoryModel.create({
        name,
        restaurant,
        active,
      });
      newCategory.save();
      // Return A Response To Front End
      return res.status(201).json({
        msg: "New Category Has Been Created Successfully!",
        data: {
          name,
          restaurant,
          active,
        },
      });
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Something Went Wrong!", error: error });
    }
  },
  // Update Category
  UpdateCategory: async (req, res) => {
    const { id, name, active } = req.body;
    try {
      if (isValidObjectId(id)) {
        const category = await CategoryModel.findByIdAndUpdate(id, {
          $set: {
            name,
            active,
          },
        });
        // If Updated
        if (category)
          return res.status(200).json({ msg: "Category Has Been Updated !" });
        // If Not
        return res.status(400).json({ msg: "Not Found" });
      }
      return res.status(400).json({ msg: "Invalid Category" });
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Something Went Wrong!", error: error });
    }
  },
  // Delete Category
  DeleteCategory: async (req, res) => {
    const { id } = req.params;
    try {
      if (isValidObjectId(id)) {
        const category = await CategoryModel.findByIdAndDelete(id);
        const dishes = await DishModel.find({ category: id });
        if (dishes.length != 0) {
          // If There Is Dishes In The Category
          const dishesToDelete = await DishModel.deleteMany({
            _id: { $in: dishes },
          });
          if (dishesToDelete.deletedCount)
            return res.status(200).json({ msg: "تم حذف القسم بنجاخ" });
        } else {
          if (category)
            return res.status(200).json({ msg: "تم حذف القسم بنجاخ" });
        }
        return res.status(400).json({ msg: "لا يوجد" });
      }
      return res.status(400).json({ msg: "Invalid Category" });
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Something Went Wrong!", error: error });
    }
  },
};
module.exports = CategoryController;
