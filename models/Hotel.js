import mongoose from "mongoose";

const HotelSchema = new mongoose.Schema({
  hotel_id: {
    type: Number,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  h_group: {
    type: String,
    default: "",
  },
  h_addr: {
    type: String,
    default: "",
  },
  h_region: {
    type: String,
  },
  h_plan_region: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

const Hotel = mongoose.model("hotel", HotelSchema);

export default Hotel;
