import mongoose from "mongoose";

const AgencySchema = new mongoose.Schema({
  ageycy_id: {
    type: Number,
    require: true,
  },
  ref: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  country: {
    type: String,
    default: "",
  },
  tel: {
    type: String,
    default: "",
  },

  email: {
    type: String,
  },
  website: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

const Agency = mongoose.model("agency", AgencySchema);

export default Agency;
