const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema({
  orders: [
    {
      order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "dishes",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
    },
  ],
  table: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tables",
    required: true,
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "restaurants",
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date,
  },
  active: {
    type: Boolean,
    default: true,
  },
});
const OrderModel = mongoose.model("orders", OrderSchema);
module.exports = OrderModel;
