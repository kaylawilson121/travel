import express from "express";
const router = express.Router();

import Service from "../../models/Service";

router.get("/", async (req, res) => {
  try {
    // Start of the day (00:00:00)

    const serviceData = await Service.find();

    // Find the maximum res_num within the same date range
    const maxResNum = await Service.aggregate([
      {
        $group: {
          _id: null,
          maxResNum: { $max: "$service_id" },
        },
      },
    ]);

    // Extract maxResNum value or set it to null if no data found
    const maxNumValue = maxResNum.length > 0 ? maxResNum[0].maxResNum : null;

    res.json({ data: serviceData, max_num: maxNumValue });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/deletedata", async (req, res) => {
  const { date, id } = req.body;
  try {
    // Delete the document with the specified id
    await Service.findByIdAndDelete(id);
    const serviceData = await Service.find();

    // Find the maximum res_num within the same date range
    const maxResNum = await Service.aggregate([
      {
        $group: {
          _id: null,
          maxResNum: { $max: "$service_id" },
        },
      },
    ]);

    // Extract maxResNum value or set it to null if no data found
    const maxNumValue = maxResNum.length > 0 ? maxResNum[0].maxResNum : null;

    res.json({ data: serviceData, max_num: maxNumValue });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/putservicedata", async (req, res) => {
  const { newData } = req.body;

  try {
    const newItem = {
      service_id: newData.service_id,
      name: newData.name,
    };
    if (newData._id) {
      // Check if the document with the given _id exists
      let document = await Service.findOne({ _id: newData._id });

      if (document) {
        // Update the document if it exists
        await Service.updateOne({ _id: newData._id }, newItem);
      }
    } else {
      // If _id is empty or not provided, create a new document
      await Service.create(newItem);
    }

    const serviceData = await Service.find();

    // Find the maximum res_num within the same date range
    const maxResNum = await Service.aggregate([
      {
        $group: {
          _id: null,
          maxResNum: { $max: "$service_id" },
        },
      },
    ]);

    // Extract maxResNum value or set it to null if no data found
    const maxNumValue = maxResNum.length > 0 ? maxResNum[0].maxResNum : null;

    res.json({ data: serviceData, max_num: maxNumValue });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

export default router;
