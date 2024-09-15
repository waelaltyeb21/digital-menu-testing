const { isValidObjectId, default: mongoose } = require("mongoose");
const DishModel = require("../Models/DishModel");
const RestaurantModel = require("../Models/RestaurantModel");

const DishController = {
  // All Dishes
  GetDishes: async (req, res) => {
    const { restaurant } = req.params;
    try {
      if (isValidObjectId(restaurant)) {
        const [dishesWithCategories] = await RestaurantModel.aggregate([
          {
            $match: {
              _id: new mongoose.Types.ObjectId(restaurant),
            },
          },
          {
            $lookup: {
              from: "categories",
              localField: "_id",
              foreignField: "restaurant",
              as: "categories",
            },
          },
          {
            $lookup: {
              from: "dishes",
              localField: "categories._id",
              foreignField: "category",
              as: "dishes",
            },
          },
          {
            $project: {
              _id: 0,
              categories: "$categories",
              dishes: "$dishes",
            },
          },
        ]);
        // If Dishes Found
        if (dishesWithCategories) return res.status(200).json(dishesWithCategories);
        return res.status(400).json({ msg: "No Dish Found" });
      }
      return res.status(400).json({ msg: "Invalid Restaurant" });
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Something Went Wrong!", error: error });
    }
  },
  GetDishesByCategory: async (req, res) => {
    try {
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Something Went Wrong!", error: error });
    }
  },
  // Get Dish By ID
  GetDish: async (req, res) => {
    const { id } = req.params;
    try {
      if (isValidObjectId(id)) {
        const dish = await DishModel.findById(id);
        console.log(dish);
        if (!dish) return res.status(400).json({ msg: "No Dish Found" });
        // -----------------------------------------------------
        // -----------------------------------------------------
        return res.status(200).json(dish);
      }
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Something Went Wrong!", error: error });
    }
  },
  // Create New Dish
  CreateNewDish: async (req, res) => {
    const { name, price, category, active } = req.body;
    try {
      // Check If Dish Is Exist
      const [dish] = await DishModel.find({ name: name, category: category });
      // Return Error
      if (dish)
        return res.status(400).json({ msg: "This Dish Is Already Exist!" });
      // Create New Dish
      const newDish = await DishModel.create({ name, price, category, active });
      newDish.save();
      return res
        .status(201)
        .json({ msg: "New Dish Has Been Created Successfully!" });
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Something Went Wrong!", error: error });
    }
  },
  // Update Dish
  UpdateDish: async (req, res) => {
    const { id, name, category, price, active } = req.body;
    try {
      if (isValidObjectId(id)) {
        const dish = await DishModel.findByIdAndUpdate(id, {
          $set: {
            name,
            category,
            price,
            active,
          },
        });
        if (dish)
          return res.status(200).json({ msg: "Dish Has Been Updated!" });
        // If Not Found
        return res.status(400).json({ msg: "Invalid Request!" });
      }
      return res.status(400).json({ msg: "Invalid Request!" });
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Something Went Wrong!", error: error });
    }
  },
  // Delete Dish
  DeleteDish: async (req, res) => {
    const { id } = req.params;
    console.log(id);
    try {
      const dish = await DishModel.findByIdAndDelete(id);
      console.log(dish);
      return res.status(200).json({ msg: "Deleted" });
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Something Went Wrong!", error: error });
    }
  },
};
module.exports = DishController;
