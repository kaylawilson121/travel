import express from "express";
const router = express.Router();

import Resa from "../../models/Resa";

router.get("/getalldata", async (req, res) => {
  try {
    const resaData = await Resa.find();
    res.json(resaData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/getresadata", async (req, res) => {
  const {
    filterData,
    orderKey,
    orderDirect,
    filterOption,
    page = 1,
    limit = 10,
  } = req.body;
  const pageNumber = parseInt(page, 10);
  const pageSize = parseInt(limit, 10);
  try {
    // Fetch data with sorting and pagination
    const filter = filterData
      ? { [filterOption]: { $regex: filterData, $options: "i" } } // "i" for case-insensitive search
      : {};

    const resaDataPromise = Resa.find(filter)
      .sort({ [orderDirect]: orderKey === "asc" ? 1 : -1 }) // Sort based on order and orderBy
      .skip((pageNumber - 1) * pageSize) // Skip to the correct page
      .limit(pageSize); // Limit the number of records

    const totalDocumentsPromise = Resa.countDocuments(filter); // Include the filter here

    const maxDossierNoPromise = Resa.aggregate([
      { $group: { _id: null, maxDossierNo: { $max: "$dossier_no" } } },
    ]);

    // Resolve all promises concurrently
    const [resaData, totalDocuments, maxDossierNoResult] = await Promise.all([
      resaDataPromise,
      totalDocumentsPromise,
      maxDossierNoPromise,
    ]);

    const maxDossierNo =
      maxDossierNoResult.length > 0 ? maxDossierNoResult[0].maxDossierNo : null;
    // Send response
    res.json({
      data: resaData,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalDocuments / pageSize),
      totalItems: totalDocuments,
      maxDossierNo: maxDossierNo,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/getresadata-date", async (req, res) => {
  const {
    start,
    end,
    filterData,
    orderKey,
    orderDirect,
    filterOption,
    page = 1,
    limit = 10,
  } = req.body;
  const pageNumber = parseInt(page, 10);
  const pageSize = parseInt(limit, 10);
  const startOfDay = new Date(start);
  startOfDay.setDate(startOfDay.getDate());
  startOfDay.setHours(0, 0, 0, 0);

  // End of the day (23:59:59.999)
  const endOfDay = new Date(end);
  endOfDay.setDate(endOfDay.getDate());
  endOfDay.setHours(23, 59, 59, 999);
  try {
    // Fetch data with sorting and pagination
    const filter = {
      ...(filterData && {
        [filterOption]: { $regex: filterData, $options: "i" },
      }), // Filter by client if filterData is provided
      service_date: { $gte: startOfDay, $lte: endOfDay }, // Filter by date range
    };

    const resaDataPromise = Resa.find(filter)
      .sort({ [orderDirect]: orderKey === "asc" ? 1 : -1 }) // Sort based on order and orderBy
      .skip((pageNumber - 1) * pageSize) // Skip to the correct page
      .limit(pageSize); // Limit the number of records

    const totalDocumentsPromise = Resa.countDocuments(filter); // Include the filter here

    const maxDossierNoPromise = Resa.aggregate([
      { $group: { _id: null, maxDossierNo: { $max: "$dossier_no" } } },
    ]);

    // Resolve all promises concurrently
    const [resaData, totalDocuments, maxDossierNoResult] = await Promise.all([
      resaDataPromise,
      totalDocumentsPromise,
      maxDossierNoPromise,
    ]);

    const maxDossierNo =
      maxDossierNoResult.length > 0 ? maxDossierNoResult[0].maxDossierNo : null;
    // Send response
    res.json({
      data: resaData,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalDocuments / pageSize),
      totalItems: totalDocuments,
      maxDossierNo: maxDossierNo,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/deletedata", async (req, res) => {
  const { id } = req.body;

  try {
    // Delete the document with the specified id
    await Resa.findByIdAndDelete(id);

    const resaData = await Resa.find();

    const maxDossierNoPromise = Resa.aggregate([
      { $group: { _id: null, maxDossierNo: { $max: "$dossier_no" } } },
    ]);

    const maxDossierNoResult = await maxDossierNoPromise;
    const maxDossierNo =
      maxDossierNoResult.length > 0 ? maxDossierNoResult[0].maxDossierNo : null;
    // Send response
    res.json({
      data: resaData,
      maxDossierNo: maxDossierNo,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/putresadata", async (req, res) => {
  const { newData } = req.body;
  try {
    const newItem = {
      dossier_no: newData.dossier_no,
      service_type: newData.service_type,
      arb_dep: newData.arb_dep,
      client: newData.client,
      agency: newData.agency,
      from: newData.from,
      to: newData.to,
      excursion: newData.excursion,
      from_region: newData.from_region,
      to_region: newData.to_region,
      service_date: newData.service_date,
      vehicle_type: newData.vehicle_type,
      adult: newData.adult,
      child: newData.child,
      infant: newData.infant,
      teen: newData.teen,
      flight_no: newData.flight_no,
      flight_time: newData.flight_time,
      resa_remark: newData.resa_remark,
      service: newData.service,
      adult_price: newData.adult_price,
      child_price: newData.child_price,
      total_price: newData.total_price,
      cur: newData.cur,
      agency_ref: newData.agency_ref,
      invoice_no: newData.invoice_no,
      status: newData.status,
      effect_date: newData.effect_date,
      pickup_time: newData.pickup_time,
      verified: newData.verified,
      by: newData.by,
      amount: newData.amount,
      last_update: Date.now(),
    };
    if (newData._id) {
      // Check if the document with the given _id exists
      let document = await Resa.findOne({ _id: newData._id });

      if (document) {
        // Update the document if it exists
        await Resa.updateOne({ _id: newData._id }, newItem);
      }
    } else {
      // If _id is empty or not provided, create a new document
      let dossierNo = newData.dossier_no;
      let existingItem;
      do {
        existingItem = await Resa.findOne({ dossier_no: dossierNo });
        if (existingItem) {
          dossierNo++;
        }
      } while (existingItem);

      newItem.dossier_no = dossierNo;
      await Resa.create(newItem);
    }

    const resaData = await Resa.find();

    const maxDossierNoPromise = Resa.aggregate([
      { $group: { _id: null, maxDossierNo: { $max: "$dossier_no" } } },
    ]);

    const maxDossierNoResult = await maxDossierNoPromise;
    const maxDossierNo =
      maxDossierNoResult.length > 0 ? maxDossierNoResult[0].maxDossierNo : null;

    res.json({
      data: resaData,
      maxDossierNo: maxDossierNo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.post("/getdailydata", async (req, res) => {
  const { start, end } = req.body.data;
  try {
    // Start of the day (00:00:00)
    const startOfDay = new Date(start);
    startOfDay.setDate(startOfDay.getDate());
    startOfDay.setHours(0, 0, 0, 0);

    // End of the day (23:59:59.999)
    const endOfDay = new Date(end);
    endOfDay.setDate(endOfDay.getDate());
    endOfDay.setHours(23, 59, 59, 999);

    const resaData = await Resa.find({
      service_date: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    // Find the maximum res_num within the same date range
    const maxResNum = await Resa.aggregate([
      {
        $group: {
          _id: null,
          maxResNum: { $max: "$dossier_no" },
        },
      },
    ]);

    // Extract maxResNum value or set it to null if no data found
    const maxResNumValue = maxResNum.length > 0 ? maxResNum[0].maxResNum : null;

    res.json({ data: resaData, max_num: maxResNumValue });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/deletedailydata", async (req, res) => {
  const { start, end, id } = req.body;
  try {
    // Delete the document with the specified id
    await Resa.findByIdAndDelete(id);

    const resaData = await Resa.find();

    // Find the maximum res_num within the same date range
    const maxResNum = await Resa.aggregate([
      {
        $group: {
          _id: null,
          maxResNum: { $max: "$dossier_no" },
        },
      },
    ]);

    // Extract maxResNum value or set it to null if no data found
    const maxResNumValue = maxResNum.length > 0 ? maxResNum[0].maxResNum : null;

    res.json({ data: resaData, max_num: maxResNumValue });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/putdailydata", async (req, res) => {
  const { newData } = req.body;

  try {
    const newItem = {
      dossier_no: newData.dossier_no,
      service_type: newData.service_type,
      arb_dep: newData.arb_dep,
      client: newData.client,
      agency: newData.agency,
      from: newData.from,
      to: newData.to,
      excursion: newData.excursion,
      from_region: newData.from_region,
      to_region: newData.to_region,
      service_date: newData.service_date,
      vehicle_type: newData.vehicle_type,
      adult: newData.adult,
      child: newData.child,
      infant: newData.infant,
      teen: newData.teen,
      pickup_time: newData.pickup_time,
      flight_no: newData.flight_no,
      flight_time: newData.flight_time,
      resa_remark: newData.resa_remark,
      service: newData.service,
      agency_ref: newData.agency_ref,
      adult_price: newData.adult_price,
      child_price: newData.child_price,
      total_price: newData.total_price,
      cur: newData.cur,
      invoice_no: newData.invoice_no,
      status: newData.status,
      effect_date: newData.effect_date,
      driver: newData.driver,
      guid: newData.guid,
      license: newData.license,
      verified: newData.verified,
      by: newData.by,
      amount: newData.amount,
      last_update: Date.now(),
    };
    if (newData._id) {
      // Check if the document with the given _id exists
      let document = await Resa.findOne({ _id: newData._id });

      if (document) {
        // Update the document if it exists
        await Resa.updateOne({ _id: newData._id }, newItem);
      }
    } else {
      // If _id is empty or not provided, create a new document
      let dossierNo = newData.dossier_no;
      let existingItem;
      do {
        existingItem = await Resa.findOne({ dossier_no: dossierNo });
        if (existingItem) {
          dossierNo++;
        }
      } while (existingItem);

      newItem.dossier_no = dossierNo;
      await Resa.create(newItem);
    }

    const resaData = await Resa.find();

    // Find the maximum res_num within the same date range
    const maxResNum = await Resa.aggregate([
      {
        $group: {
          _id: null,
          maxResNum: { $max: "$dossier_no" },
        },
      },
    ]);

    // Extract maxResNum value or set it to null if no data found
    const maxResNumValue = maxResNum.length > 0 ? maxResNum[0].maxResNum : null;

    res.json({ data: resaData, max_num: maxResNumValue });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.post("/getexportdata", async (req, res) => {
  const { start, end, filterData, filterOption } = req.body.data;

  try {
    let query = {};

    // Date range filter
    if (start && end) {
      const startOfDay = new Date(start);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(end);
      endOfDay.setHours(23, 59, 59, 999);

      query.service_date = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
    }

    // Additional filter based on filterData and filterOption
    if (filterData && filterOption) {
      query[filterOption] = { $regex: filterData, $options: "i" };
    }

    const resaData = await Resa.find(query);

    res.json({ data: resaData });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/dashboarddata", async (req, res) => {
  try {
    const data = await Resa.aggregate([
      {
        $group: {
          _id: "$arb_dep", // Group by arb_dep
          count: { $sum: 1 }, // Count the number of items in each group
        },
      },
      {
        $sort: { _id: 1 }, // Optionally sort the results by arb_dep
      },
    ]);
    console.log(data);

    res.status(200).json(data); // Send the aggregated data back to the client
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching data", error: error.message });
  }
});

export default router;
