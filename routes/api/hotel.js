import express from "express";
const router = express.Router();

import Hotel from "../../models/Hotel";

router.get("/", async (req, res) => {
  try {
    // Start of the day (00:00:00)

    const hotelData = await Hotel.find();

    // Find the maximum res_num within the same date range
    const maxResNum = await Hotel.aggregate([
      {
        $group: {
          _id: null,
          maxResNum: { $max: "$hotel_id" },
        },
      },
    ]);

    // Extract maxResNum value or set it to null if no data found
    const maxNumValue = maxResNum.length > 0 ? maxResNum[0].maxResNum : null;

    res.json({ data: hotelData, max_num: maxNumValue });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/deletedata", async (req, res) => {
  const { date, id } = req.body;
  try {
    // Delete the document with the specified id
    await Hotel.findByIdAndDelete(id);
    const hotelData = await Hotel.find();

    // Find the maximum res_num within the same date range
    const maxResNum = await Hotel.aggregate([
      {
        $group: {
          _id: null,
          maxResNum: { $max: "$hotel_id" },
        },
      },
    ]);

    // Extract maxResNum value or set it to null if no data found
    const maxNumValue = maxResNum.length > 0 ? maxResNum[0].maxResNum : null;

    res.json({ data: hotelData, max_num: maxNumValue });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/puthoteldata", async (req, res) => {
  const { newData } = req.body;

  try {
    const newItem = {
      hotel_id: newData.hotel_id,
      name: newData.name,
      h_group: newData.h_group,
      h_addr: newData.h_addr,
      h_region: newData.h_region,
      h_plan_region: newData.h_plan_region,
    };
    if (newData._id) {
      // Check if the document with the given _id exists
      let document = await Hotel.findOne({ _id: newData._id });

      if (document) {
        // Update the document if it exists
        await Hotel.updateOne({ _id: newData._id }, newItem);
      }
    } else {
      // If _id is empty or not provided, create a new document
      await Hotel.create(newItem);
    }

    const hotelData = await Hotel.find();

    // Find the maximum res_num within the same date range
    const maxResNum = await Hotel.aggregate([
      {
        $group: {
          _id: null,
          maxResNum: { $max: "$hotel_id" },
        },
      },
    ]);

    // Extract maxResNum value or set it to null if no data found
    const maxNumValue = maxResNum.length > 0 ? maxResNum[0].maxResNum : null;

    res.json({ data: hotelData, max_num: maxNumValue });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

export default router;
