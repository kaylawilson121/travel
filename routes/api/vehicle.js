import express from "express";
const router = express.Router();

import Vehicle from "../../models/Vehicle";

router.get("/", async (req, res) => {
  try {
    // Start of the day (00:00:00)

    const vehicleData = await Vehicle.find();

    // Find the maximum res_num within the same date range
    const maxResNum = await Vehicle.aggregate([
      {
        $group: {
          _id: null,
          maxResNum: { $max: "$vehicle_id" },
        },
      },
    ]);

    // Extract maxResNum value or set it to null if no data found
    const maxNumValue = maxResNum.length > 0 ? maxResNum[0].maxResNum : null;

    res.json({ data: vehicleData, max_num: maxNumValue });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/deletedata", async (req, res) => {
  const { date, id } = req.body;
  try {
    // Delete the document with the specified id
    await Vehicle.findByIdAndDelete(id);
    const vehicleData = await Vehicle.find();

    // Find the maximum res_num within the same date range
    const maxResNum = await Vehicle.aggregate([
      {
        $group: {
          _id: null,
          maxResNum: { $max: "$vehicle_id" },
        },
      },
    ]);

    // Extract maxResNum value or set it to null if no data found
    const maxNumValue = maxResNum.length > 0 ? maxResNum[0].maxResNum : null;

    res.json({ data: vehicleData, max_num: maxNumValue });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/putvehicledata", async (req, res) => {
  const { newData } = req.body;

  try {
    const newItem = {
      vehicle_id: newData.vehicle_id,
      name: newData.name,
    };
    if (newData._id) {
      // Check if the document with the given _id exists
      let document = await Vehicle.findOne({ _id: newData._id });

      if (document) {
        // Update the document if it exists
        await Vehicle.updateOne({ _id: newData._id }, newItem);
      }
    } else {
      // If _id is empty or not provided, create a new document
      await Vehicle.create(newItem);
    }

    const vehicleData = await Vehicle.find();

    // Find the maximum res_num within the same date range
    const maxResNum = await Vehicle.aggregate([
      {
        $group: {
          _id: null,
          maxResNum: { $max: "$vehicle_id" },
        },
      },
    ]);

    // Extract maxResNum value or set it to null if no data found
    const maxNumValue = maxResNum.length > 0 ? maxResNum[0].maxResNum : null;

    res.json({ data: vehicleData, max_num: maxNumValue });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

export default router;
