import mongoose from "mongoose";

const DriverListSchema = new mongoose.Schema({
  driver_id: {
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

const DriverList = mongoose.model("driverlist", DriverListSchema);

export default DriverList;
