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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
      origin: "*",
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
// app.use(express.static(path.join(__dirname, "dist")));

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
app.get("/", (req, res) => {
  res.send("Welcome to the API");
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port:${port}`);
});
