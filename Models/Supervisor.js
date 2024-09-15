const mongoose = require("mongoose");
const SupervisorSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date,
  },
});
const Supervisor = mongoose.model("supervisors", SupervisorSchema);
module.exports = Supervisor;
