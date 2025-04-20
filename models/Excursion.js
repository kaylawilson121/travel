import mongoose from "mongoose";

const ExcursionSchema = new mongoose.Schema({
  excursion_id: { type: Number, required: true },
  name: { type: String, required: true },
  type: { type: String },
  lunch: { type: String },
  remark: { type: String },
});

const Excursion = mongoose.model("Excursion", ExcursionSchema);

export default Excursion;
