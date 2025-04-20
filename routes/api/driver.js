import express from "express";
const router = express.Router();

import Driver from "../../models/Driver";

router.get("/", async (req, res) => {
  try {
    const driverData = await Driver.find();
    const maxResNum = await Driver.aggregate([
      {
        $group: {
          _id: null,
          maxResNum: { $max: "$driver_no" },
        },
      },
    ]);

    // Extract maxResNum value or set it to null if no data found
    const maxNumValue = maxResNum.length > 0 ? maxResNum[0].maxResNum : null;

    res.json({ data: driverData, max_num: maxNumValue });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/", async (req, res) => {
  const { start, end } = req.body;
  console.log(req.body);
  try {
    // Start of the day (00:00:00)
    const startOfDay = new Date(start);
    startOfDay.setDate(startOfDay.getDate());
    startOfDay.setHours(0, 0, 0, 0);

    // End of the day (23:59:59.999)
    const endOfDay = new Date(end);
    endOfDay.setDate(endOfDay.getDate());
    endOfDay.setHours(23, 59, 59, 999);

    const driverData = await Driver.find({
      service_date: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    // Find the maximum res_num within the same date range
    const maxResNum = await Driver.aggregate([
      {
        $group: {
          _id: null,
          maxResNum: { $max: "$driver_no" },
        },
      },
    ]);

    // Extract maxResNum value or set it to null if no data found
    const maxResNumValue = maxResNum.length > 0 ? maxResNum[0].maxResNum : null;

    res.json({ data: driverData, max_num: maxResNumValue });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/deletedata", async (req, res) => {
  const { date, id } = req.body;
  try {
    // Delete the document with the specified id
    await Driver.findByIdAndDelete(id);
    const driverData = await Driver.find();

    // Find the maximum res_num within the same date range
    const maxResNum = await Driver.aggregate([
      {
        $group: {
          _id: null,
          maxResNum: { $max: "$driver_no" },
        },
      },
    ]);

    // Extract maxResNum value or set it to null if no data found
    const maxNumValue = maxResNum.length > 0 ? maxResNum[0].maxResNum : null;

    res.json({ data: driverData, max_num: maxNumValue });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/putdriverdata", async (req, res) => {
  const { newData } = req.body;

  try {
    const newItem = {
      driver_no: newData.driver_no,
      order_for: newData.order_for,
      agency: newData.agency,
      client: newData.client,
      from: newData.from,
      to: newData.to,
      pickup_time: newData.pickup_time,
      fligth_no: newData.fligth_no,
      arb_dep: newData.arb_dep,
      service_date: newData.service_date,
      adult: newData.adult,
      child: newData.child,
      infant: newData.infant,
      teen: newData.teen,
      resa_remark: newData.resa_remark,
      veh_cat: newData.veh_cat,
      veh_no: newData.veh_no,
      comments: newData.comments,
    };
    if (newData._id) {
      // Check if the document with the given _id exists
      let document = await Driver.findOne({ _id: newData._id });

      if (document) {
        // Update the document if it exists
        await Driver.updateOne({ _id: newData._id }, newItem);
      }
    } else {
      // If _id is empty or not provided, create a new document
      await Driver.create(newItem);
    }

    const driverData = await Driver.find();

    // Find the maximum res_num within the same date range
    const maxResNum = await Driver.aggregate([
      {
        $group: {
          _id: null,
          maxResNum: { $max: "$driver_no" },
        },
      },
    ]);

    // Extract maxResNum value or set it to null if no data found
    const maxNumValue = maxResNum.length > 0 ? maxResNum[0].maxResNum : null;

    res.json({ data: driverData, max_num: maxNumValue });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

export default router;
