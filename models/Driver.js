import mongoose from "mongoose";

const DriverSchema = new mongoose.Schema({
  driver_no: {
    type: Number,
  },
  order_for: {
    type: String,
  },
  arb_dep: {
    type: String,
  },
  pickup_time: {
    type: String,
  },
  fligth_no: {
    type: String,
  },
  client: {
    type: String,
    default: "",
  },
  agency: {
    type: String,
  },
  from: {
    type: String,
  },
  to: {
    type: String,
  },
  service_date: {
    type: Date,
  },
  adult: {
    type: String,
  },
  child: {
    type: String,
  },
  infant: {
    type: String,
  },
  teen: {
    type: String,
  },
  resa_remark: {
    type: String,
  },
  veh_cat: {
    type: String,
  },
  veh_no: {
    type: String,
  },
  comments: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

const Driver = mongoose.model("driver", DriverSchema);

export default Driver;
