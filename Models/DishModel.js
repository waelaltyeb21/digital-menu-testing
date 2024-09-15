const mongoose = require("mongoose");
const DishSchema = new mongoose.Schema({
  name: {
    type: Object,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "categories",
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
});
const DishModel = mongoose.model("dishes", DishSchema);
module.exports = DishModel;
