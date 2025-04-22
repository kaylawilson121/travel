import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
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

const updateServiceDates = async (filename) => {
  // Replace with the path to your Excel file
  
  const filePath = `./uploads/${req.file.filename}.xlsx`;
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
    let document = await Resa.findOne({ dossier_no: resat.dossier_no });

    if (document) {
      // Update the document if it exists
      await Resa.updateOne({ dossier_no: newData.dossier_no }, {    
        ...resat,
        verified : resat.verified == 'Yes' ? 1 : 0,
      });
    } else {
      const res = new Resa({
        ...resat,
        verified : resat.verified == 'Yes' ? 1 : 0,
      });
      await res.save(); 
    }
  }
}

// updateServiceDates();




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
      origin: "https://escapadezanzibar-pd2a.vercel.app",
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
  })
)
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

app.use('/uploads', express.static('uploads'));
app.post('/upload', upload.single('file'), (req, res) => {
  console.log("upload file", req.file);
  if (!req.file) return res.status(400).send('No file uploaded');
  res.json({ filename: req.file.filename, path: `/uploads/${req.file.filename}.xlsx`});
  
  updateServiceDates(req.file.filename);
});


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
