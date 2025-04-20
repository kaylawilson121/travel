import express from "express";
const router = express.Router();

import DriverList from "../../models/DriverList";

router.get("/", async (req, res) => {
  try {
    // Start of the day (00:00:00)

    const driverListData = await DriverList.find();

    // Find the maximum res_num within the same date range
    const maxResNum = await DriverList.aggregate([
      {
        $group: {
          _id: null,
          maxResNum: { $max: "$driver_id" },
        },
      },
    ]);

    // Extract maxResNum value or set it to null if no data found
    const maxNumValue = maxResNum.length > 0 ? maxResNum[0].maxResNum : null;

    res.json({ data: driverListData, max_num: maxNumValue });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/deletedata", async (req, res) => {
  const { date, id } = req.body;
  try {
    // Delete the document with the specified id
    await DriverList.findByIdAndDelete(id);
    const driverListData = await DriverList.find();

    // Find the maximum res_num within the same date range
    const maxResNum = await DriverList.aggregate([
      {
        $group: {
          _id: null,
          maxResNum: { $max: "$driver_id" },
        },
      },
    ]);

    // Extract maxResNum value or set it to null if no data found
    const maxNumValue = maxResNum.length > 0 ? maxResNum[0].maxResNum : null;

    res.json({ data: driverListData, max_num: maxNumValue });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/put-driver-list", async (req, res) => {
  const { newData } = req.body;

  try {
    const newItem = {
      driver_id: newData.driver_id,
      name: newData.name,
    };
    if (newData._id) {
      // Check if the document with the given _id exists
      let document = await DriverList.findOne({ _id: newData._id });

      if (document) {
        // Update the document if it exists
        await DriverList.updateOne({ _id: newData._id }, newItem);
      }
    } else {
      // If _id is empty or not provided, create a new document
      await DriverList.create(newItem);
    }

    const driverListData = await DriverList.find();

    // Find the maximum res_num within the same date range
    const maxResNum = await DriverList.aggregate([
      {
        $group: {
          _id: null,
          maxResNum: { $max: "$driver_id" },
        },
      },
    ]);

    // Extract maxResNum value or set it to null if no data found
    const maxNumValue = maxResNum.length > 0 ? maxResNum[0].maxResNum : null;

    res.json({ data: driverListData, max_num: maxNumValue });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

export default router;
