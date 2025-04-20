import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
  service_id: {
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

const Service = mongoose.model("service", ServiceSchema);

export default Service;
