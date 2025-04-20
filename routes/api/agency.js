import express from "express";
const router = express.Router();

import Agency from "../../models/Agency";

router.get("/", async (req, res) => {
  try {
    // Start of the day (00:00:00)

    const agencyData = await Agency.find();

    // Find the maximum res_num within the same date range
    const maxResNum = await Agency.aggregate([
      {
        $group: {
          _id: null,
          maxResNum: { $max: "$ageycy_id" },
        },
      },
    ]);

    // Extract maxResNum value or set it to null if no data found
    const maxNumValue = maxResNum.length > 0 ? maxResNum[0].maxResNum : null;

    res.json({ data: agencyData, max_num: maxNumValue });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/deletedata", async (req, res) => {
  const { date, id } = req.body;
  try {
    // Delete the document with the specified id
    await Agency.findByIdAndDelete(id);
    const agencyData = await Agency.find();

    // Find the maximum res_num within the same date range
    const maxResNum = await Agency.aggregate([
      {
        $group: {
          _id: null,
          maxResNum: { $max: "$ageycy_id" },
        },
      },
    ]);

    // Extract maxResNum value or set it to null if no data found
    const maxNumValue = maxResNum.length > 0 ? maxResNum[0].maxResNum : null;

    res.json({ data: agencyData, max_num: maxNumValue });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/putagencydata", async (req, res) => {
  const { newData } = req.body;

  try {
    const newItem = {
      ageycy_id: newData.ageycy_id,
      name: newData.name,
      country: newData.country,
      tel: newData.tel,
      name2: newData.name2,
      email: newData.email,
      website: newData.website,
      status: newData.status,
      tax: newData.tax,
    };
    if (newData._id) {
      // Check if the document with the given _id exists
      let document = await Agency.findOne({ _id: newData._id });

      if (document) {
        // Update the document if it exists
        await Agency.updateOne({ _id: newData._id }, newItem);
      }
    } else {
      // If _id is empty or not provided, create a new document
      await Agency.create(newItem);
    }

    const agencyData = await Agency.find();

    // Find the maximum res_num within the same date range
    const maxResNum = await Agency.aggregate([
      {
        $group: {
          _id: null,
          maxResNum: { $max: "$ageycy_id" },
        },
      },
    ]);

    // Extract maxResNum value or set it to null if no data found
    const maxNumValue = maxResNum.length > 0 ? maxResNum[0].maxResNum : null;

    res.json({ data: agencyData, max_num: maxNumValue });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

export default router;
