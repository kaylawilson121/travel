import mongoose from "mongoose";

const ResaSchema = new mongoose.Schema({
  dossier_no: {
    type: Number,
    unique: true,
  },
  by: {
    type: String,
    default: "",
  },
  verified: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    default: "",
  },
  service: {
    type: String,
    default: "",
  },
  service_type: {
    type: String,
  },
  agency_ref: {
    type: String,
    default: "",
  },
  agency: {
    type: String,
  },
  client: {
    type: String,
    default: "",
  },
  from: {
    type: String,
  },
  to: {
    type: String,
  },
  excursion: {
    type: String,
    default: "",
  },
  service_date: {
    type: Date,
  },
  flight_no: {
    type: String,
  },
  flight_time: {
    type: String,
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
  from_region: {
    type: String,
  },
  to_region: {
    type: String,
  },
  vehicle_type: {
    type: String,
  },
  invoice_no: {
    type: String,
  },
  amount: {
    type: String,
  },
  adult_price: {
    type: String,
  },
  child_price: {
    type: String,
  },
  teen_price: {
    type: String,
  },
  total_price: {
    type: String,
  },
  cur: {
    type: String,
  },
  driver: {
    type: String,
  },
  guid: {
    type: String,
  },
  license: { type: Array },
  pickup_time: {
    type: String,
  },
  last_update: {
    type: Date,
    default: Date.now(),
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

const Resa = mongoose.model("resa", ResaSchema);

export default Resa;
