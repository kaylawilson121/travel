import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import path from "path";
import * as XLSX from 'xlsx';

import connectDB from "./config/database";
import createAdmin from "./config/createAdmin";
import saveData from "./config/saveData";

import auth from "./routes/api/auth";
import admin from "./routes/api/admin";
import resa from "./routes/api/resa";
import hotel from "./routes/api/hotel";
import agency from "./routes/api/agency";
import service from "./routes/api/service";
import driver from "./routes/api/driver";
import vehicle from "./routes/api/vehicle";
import guid from "./routes/api/guid";
import driverList from "./routes/api/driverList";
import excursion from "./routes/api/excursion";
import Resa from "./models/Resa.js"; // Update this import path based on your project structure
import fs from "fs";

dotenv.config();

const app = express();

connectDB();
createAdmin();
// saveData();

// // Find and update all documents
// const updateServiceDates = async () => {
//   try {
//     const bulkOps = [];

//     // Fetch all documents (you can batch this if you want for performance)
//     const allResas = await Resa.find({}, { _id: 1, service_date: 1 });

//     for (const resa of allResas) {
//       if (resa.service_date) {
//         const newDate = new Date(resa.service_date);
//         newDate.setDate(newDate.getDate() + 1); // Add one day

//         bulkOps.push({
//           updateOne: {
//             filter: { _id: resa._id },
//             update: { $set: { service_date: newDate } },
//           },
//         });
//       }
//     }

//   } catch (err) {
//     console.error("Error updating service_date:", err);
//   }
// };

const updateServiceDates = async () => {
  // Replace with the path to your Excel file
  
  const filePath = './reworked.xlsx';
  const bulkOps = [];
  // Read file buffer
  const fileBuffer = fs.readFileSync(filePath);

  // Parse with xlsx
  const workbook = XLSX.read(fileBuffer, { type: 'array' });

  // Get first sheet
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  
  const json = XLSX.utils.sheet_to_json(sheet, {
    raw: false,
    cellDates: true
  });

  for (const resat of json) {

    const res = new Resa({
      ...resat,
      verified : resat.verified == 'Yes' ? 1 : 0,
    });
    await res.save(); // Save each item to the database
  }
}

// updateServiceDates();



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: "2000mb", extended: false }));
app.use(
  cors({
      origin: "https://escapadezanzibar-pd2a.vercel.app/",
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
  })
)
// app.use(
//   cors(
//     {
//       origin: "https://77.247.126.189:3050/",
//       methods: ["GET", "POST", "PUT", "DELETE"],
//       credentials: true,
//     }
//   )
// )
// // Serve static files from the dist directory
app.use(express.static(path.join(__dirname, "dist")));

app.use("/api/auth", auth);
app.use("/api/admin", admin);
app.use("/api/resa", resa);
app.use("/api/hotel", hotel);
app.use("/api/agency", agency);
app.use("/api/service", service);
app.use("/api/driver", driver);
app.use("/api/vehicle", vehicle);
app.use("/api/guid", guid);
app.use("/api/driver-list", driverList);
app.use("/api/excursion", excursion);
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port:${port}`);
});
