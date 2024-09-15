const mongoose = require("mongoose");
const RestaurantSchema = new mongoose.Schema({
  name: {
    type: Object,
    required: true,
  },
  shift: {
    type: Object,
    required: true,
  },
  coords: {
    type: Object,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
});
const RestaurantModel = mongoose.model("restaurants", RestaurantSchema);
module.exports = RestaurantModel;
