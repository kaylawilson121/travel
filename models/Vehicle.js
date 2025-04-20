import mongoose from "mongoose";

const VehicleSchema = new mongoose.Schema({
  vehicle_id: {
    type: Number,
  },
  name: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

const Vehicle = mongoose.model("vehicle", VehicleSchema);

export default Vehicle;
