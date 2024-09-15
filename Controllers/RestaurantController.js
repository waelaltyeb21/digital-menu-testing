const { default: mongoose, isValidObjectId } = require("mongoose");
const RestaurantModel = require("../Models/RestaurantModel");
const TableModel = require("../Models/TableModel");

const RestaurantController = {
  // Get All Restaurants
  GetRestaurants: async (req, res) => {
    try {
      const restaurants = await RestaurantModel.find();
      return res.status(200).json(restaurants);
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Something Went Wrong!", error: error });
    }
  },
  // Get Restaurant
  GetRestaurant: async (req, res) => {
    const { id } = req.params;
    try {
      if (isValidObjectId(id)) {
        const restaurant = await RestaurantModel.findById(id);
        console.log(restaurant);
        if (restaurant) return res.status(200).json(restaurant);
        // If Not Found
        return res.status(400).json({ msg: "Restaurant Not Found" });
      }
      return res.status(400).json({ msg: "Invalid Restaurant ID" });
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Something Went Wrong!", error: error });
    }
  },
  // Get Restaurant Dishes
  GetRestaurantDishes: async (req, res) => {
    const { restaurantID, tableID } = req.params;
    console.log(restaurantID, tableID);
    try {
      if (isValidObjectId(restaurantID) && isValidObjectId(tableID)) {
        const restaurant = await RestaurantModel.findById(restaurantID);
        if (!restaurant)
          return res.status(400).json({
            msg: {
              ar: "هذا المطعم ليس موجودا",
              en: "This Restaurant Is Not Registreted Yet!",
            },
            restaurant,
          });
        // ---------------------------------------------------------------
        const [restaurantData] = await RestaurantModel.aggregate([
          {
            $match: {
              _id: new mongoose.Types.ObjectId(restaurantID),
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
              restaurant: {
                _id: "$_id",
                name: "$name",
                coords: "$coords",
                shift: "$shift",
                active: "$active",
              },
              categories: "$categories",
              dishes: "$dishes",
            },
          },
        ]);
        // ---------------------------------------------------------------
        // Restaurant Message => " Quote "
        // ---------------------------------------------------------------
        // If Restaurant Is Active
        if (restaurantData.restaurant.active) {
          // Fetch Table And Return Response
          const table = await TableModel.findById(tableID);
          if (!table)
            return res.status(401).json({
              msg: {
                ar: "لا توجد طاولة",
                en: "Table Not Found",
              },
            });
          return res.status(200).json({ ...restaurantData, table });
        } else {
          // If Not Active => Return Error Response
          return res.status(400).json({
            msg: {
              ar: "هذا المطعم متوقف عن العمل مؤقتا",
              en: "This Restaurant Is Out Of Service Right Now.",
            },
          });
        }
        // ---------------------------------------------------------------
      }
      return res.status(401).json({
        msg: {
          ar: "",
          en: "Attempting To Enter Restaurant Or Table ID Manually!",
        },
      });
    } catch (error) {
      return res.status(500).json({
        msg: { ar: "", en: "Something Went Wrong!" },
        error: error.message,
      });
    }
  },
  // Create New Restaurant
  CreateNewRestaurant: async (req, res) => {
    const { name, shift, coords, logo, active } = req.body;
    console.log(name, shift, coords, logo, active);
    try {
      // Check If Restaurant Exist Or Not
      const [restaurant] = await RestaurantModel.find({ name: name });
      if (restaurant)
        return res
          .status(400)
          .json({ msg: "This Restaurant Is Already Exist!" });
      // If Not Exist => Create New One
      const newRestaurant = await RestaurantModel.create({
        name,
        shift,
        coords,
        logo,
        active,
      });
      newRestaurant.save();
      console.log(newRestaurant);
      // Return A Response To FrontEnd
      return res
        .status(201)
        .json({ msg: "New Restaurant Has Been Created Successfully!" });
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Something Went Wrong!", error: error });
    }
  },
  // Update Restaurant
  UpdateRestaurant: async (req, res) => {
    try {
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Something Went Wrong!", error: error });
    }
  },
  // Delete Restaurant
  DeleteRestaurant: async (req, res) => {
    try {
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Something Went Wrong!", error: error });
    }
  },
};
module.exports = RestaurantController;
