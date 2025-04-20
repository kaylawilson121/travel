const xlsx = require("xlsx");
const path = require("path");
const fs = require("fs");

import Agency from "../models/Agency";
import Product from "../models/Product";
import Hotel from "../models/Hotel";
import Resa from "../models/Resa";
import Service from "../models/Service";
import Guid from "../models/Guid";
import DriverList from "../models/DriverList";
import Excursion from "../models/Excursion";

function convertExcelTimeToTimeString(excelTime) {
  // Excel time is a fraction of a day
  // Multiply by 24 to get hours, then split into hours and minutes
  const totalHours = excelTime * 24;
  const hours = Math.floor(totalHours);
  const minutes = Math.round((totalHours - hours) * 60) || 0;

  // Format hours and minutes to always show two digits
  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");

  // Determine AM/PM
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours12 = hours % 12 || 12;

  return `${formattedHours12}:${formattedMinutes} ${period}`;
}

const dateFormat = (num) => {
  if (!num || !Number(num)) return null;
  // Base date: January 1, 1900 (Excel uses this as the starting date)
  const baseDate = new Date(1900, 0, 1);

  // Add the number of days to the base date
  // Subtract 1 day because Excel starts counting from 1, not 0
  const resultDate = new Date(
    baseDate.getTime() +
      (Number(num) - 1) * 24 * 60 * 60 * 1000 -
      5 * 60 * 60 * 1000
  );

  return resultDate;
};

const saveData = async () => {
  // const excursions = [
  //   "DOLPHIN TRIP & JOZANI FOREST- FULL DAY - LUNCH NOT INCLUDED - STO",
  //   "DOLPHIN TRIP & SNORKELING - HALF DAY - LUNCH NOT INCLUDED - STO",
  //   "EXOTISMES PACK ESSENTIEL",
  //   "JOSANI FOREST & MUYUNI VILLAGE - FULL DAY - TRANSFER TO THE ROCK - STO",
  //   "JOSANI FOREST & MUYUNI VILLAGE - FULL DAY - LUNCH NOT INCLUDED - STO",
  //   "JOSANI FOREST & MUYUNI VILLAGE - HALF DAY - LUNCH NOT INCLUDED - STO",
  //   "JOSANI FOREST HALF DAY - EXCLUDING LUNCH - STO",
  //   "POLE POLE PACKAGE",
  //   "PRISON ISLAND - HALF DAY - 2 DEPARTS 9H00 & 14H00 - STO",
  //   "REPPING SERVICE",
  //   "SAFARI BLUE INCLUDING BBQ LUNCH - FULL DAY - STO",
  //   "SEAFARI MNEMBA INCLUDING LUNCH ONBOARD - FULL DAY - STO",
  //   "SEAWEED WOMEN COOPERATIVE",
  //   "SPICE FARM & PRISON ISLAND - FULL DAY - LUNCH NOT INCLUDED - STO",
  //   "SPICE TOUR - FULL DAY - INCLUDING LUNCH - STO",
  //   "SPICE TOUR - HALF DAY - LUNCH NOT INCLUDED - STO",
  //   "SPICE TOUR & JOZANI FOREST - FULL DAY - LUNCH - STO",
  //   "SPICE TOUR & JOZANI FOREST - FULL DAY - LUNCH NOT INCLUDED - STO",
  //   "STONE TOWN - FULL DAY WITH LUNCH - STO",
  //   "STONE TOWN - HALF DAY - LUNCH NOT INCLUDED - STO",
  //   "STONE TOWN & JOSANI - FULL DAY - LUNCH NOT INCLUDED - STO",
  //   "STONE TOWN & PRISON ISLAND - FULL DAY - LUNCH - STO",
  //   "STONE TOWN & PRISON ISLAND - FULL DAY - LUNCH NOT INCLUDED - STO",
  //   "STONE TOWN & SPICE TOUR - FULL DAY - LUNCH - STO",
  //   "STONE TOWN & SPICE TOUR - FULL DAY - LUNCH NOT INCLUDED - STO",
  //   "SUNSET CRUISE - STO",
  //   "VISIT OF STONE TOWN AND SUNSET CRUISE - STO",
  //   "OTHERS",
  // ];
  // excursions.forEach(async (excursion, index) => {
  //   const newExcursion = new Excursion({
  //     excursion_id: index + 1,
  //     name: excursion,
  //   });
  //   await newExcursion.save();
  // });

  // Specify the path to your Excel file
  const filePath = path.resolve("./main.xlsx");

  // Read the Excel file
  const workbook = xlsx.readFile(filePath);

  // Get the names of all sheets
  const sheetNames = workbook.SheetNames;

  // Initialize an object to hold all data
  const allData = {};

  // Loop through each sheet and extract data
  sheetNames.forEach((sheetName) => {
    if (sheetName == "Hotel") {
      const worksheet = workbook.Sheets[sheetName];
      const sheetData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
      const data = sheetData.filter((data) => data.length > 0);
      allData[sheetName] = data;
    }
  });

  // console.log(allData.Hotel);

  // if (allData.Agency && Array.isArray(allData.Agency)) {
  //   let agentArray = allData.Agency;

  //   agentArray.shift();
  //   let autoNum = 0;
  //   for (const item of agentArray) {
  //     // Assuming your Excel sheet has the fields that match your Agency schema
  //     const name = item[1];
  //     if (!name || name == "") continue;
  //     // let findAgency = await Agency.findOne({ name });
  //     // if (findAgency) continue;
  //     autoNum++;

  //     const agencyData = {
  //       ageycy_id: autoNum,
  //       name: item[1] || "",
  //       ref: item[2] || "",
  //       // tel: item[3] || "",
  //       // name2: item[4] || "",
  //       // email: item[5] || "",
  //       // website: item[6] || "",
  //       // status: item[7] || "",
  //       // tax: item[8] || "",
  //       // tax_regno: item[8] || "",
  //       // vat_amt: item[9] || "",
  //       // acc_code: item[10] || "",
  //       // pay_term: item[11] || "",
  //       // credit_term: item[12] || "",
  //       // paymode: item[13] || "",
  //       // reg_no: item[14] || "",
  //       // paymode: item[15] || "",
  //       // vat_type: item[16] || "",
  //       // ppostal_addr: item[17] || "",
  //       // ppostal_addr1: item[18] || "",
  //       // ppostal_addr2: item[19] || "",
  //       // ppostal_addr3: item[20] || "",
  //       // ppostal_country: item[21] || "",
  //       // billing_addr1: item[22] || "",
  //       // billing_addr2: item[23] || "",
  //       // billing_addr3: item[24] || "",
  //       // ppostal_addr3: item[25] || "",
  //       // ppostal_addr3: item[26] || "",
  //     };

  //     const agency = new Agency(agencyData);
  //     await agency.save(); // Save each item to the database
  //   }
  // }

  // if (allData.resa && Array.isArray(allData.resa)) {
  //   let resaArray = allData.resa;
  //   resaArray.shift();
  //   let autoNum = 0;
  //   for (const item of resaArray.reverse()) {
  //     // if (!dateFormat(item[8]) && !dateFormat(item[9])) continue;
  //     autoNum++;
  //     const resaData = {
  //       // Map your Excel columns to your Resa schema fields here
  //       dossier_no: autoNum,
  //       by: item[0] || "",
  //       verified: item[1] === "Yes" ? true : false,
  //       status: item[2] || "",
  //       service: item[3] || "",
  //       service_type: item[4] || "",
  //       agency_ref: item[5] || "",
  //       client: item[6] || "",
  //       agency: item[7] || "",
  //       from: item[8] || "",
  //       to: item[9] || "",
  //       excursion: item[10] || "",
  //       service_date: dateFormat(item[11]),
  //       flight_no: item[12] || "",
  //       flight_time: item[13] ? convertExcelTimeToTimeString(item[13]) : "",
  //       adult: item[14] || "",
  //       child: item[15] || "",
  //       infant: item[16] || "",
  //       teen: item[17] || "",
  //       resa_remark: item[18] || "",
  //       from_region: item[19] || "",
  //       to_region: item[20] || "",
  //       vehicle_type: item[21] || "",
  //       inv_no: item[22] || "",
  //       amount: item[23] || "",
  //       adult_price: item[24] || "",
  //       child_price: item[25] || "",
  //       teen_price: item[26] || "",
  //       total_price: item[27] || "",
  //       cur: item[28] || "",
  //     };

  //     const resa = new Resa(resaData);
  //     await resa.save(); // Save each item to the database
  //   }
  // }

  // if (allData.Hotel && Array.isArray(allData.Hotel)) {
  //   let hotelArray = allData.Hotel;
  //   hotelArray.shift();
  //   let autoNum = 0;
  //   for (const item of hotelArray) {
  //     // Assuming your Excel sheet has the fields that match your Hotel schema
  //     const name = item[1];
  //     let findHotel = await Hotel.findOne({ name });
  //     if (!name || name == "" || findHotel) continue;
  //     autoNum++;

  //     const hotelData = {
  //       hotel_id: autoNum,
  //       name: item[0],
  //       h_group: "",
  //       h_addr:  "",
  //       h_region: item[1] || "",
  //       h_plan_region:  "",
  //       // category_hotel: item[6] || "",
  //       // price_rack: item[7] || "",
  //       // cost_price: item[8] || "",
  //       // selling_price2: item[9] || "",
  //       // h_category: item[10] || "",
  //       // h_general: item[11] || "",
  //       // h_from: item[12] || "",
  //       // h_to: item[13] || "",
  //       // h_street: item[14] || "",
  //       // h_town: item[15] || "",
  //       // h_country: item[16] || "",
  //       // fini: item[17] || "",
  //       // active: item[18] || "",
  //       // h_ishotel: item[19] || "",
  //       // h_isweb: item[20] || "",
  //       // h_image: item[21] || "",
  //       // h_ext: item[22] || "",
  //       // h_description: item[23] || "",
  //       // h_check_in: item[24] || "",
  //       // h_check_out: item[25] || "",
  //       // h_late_check_out: item[26] || "",
  //       // h_num_floors: item[27] || "",
  //       // h_num_guest: item[28] || "",
  //       // h_num_suite: item[29] || "",
  //       // h_num_singlebedded: item[30] || "",
  //       // h_internet_fee: item[31] || "",
  //       // h_service_provider: item[32] || "",
  //       // h_wireless_fee: item[33] || "",
  //       // h_wireless_provider: item[34] || "",
  //       // h_language: item[35] || "",
  //       // h_pet: item[36] || "",
  //       // h_currency: item[37] || "",
  //       // h_facilities: item[38] || "",
  //     };

  //     const hotel = new Hotel(hotelData);
  //     await hotel.save(); // Save each item to the database
  //   }
  // }

  // if (allData.Service && Array.isArray(allData.Service)) {
  //   let serviceArray = allData.Service;
  //   serviceArray.shift();
  //   let autoNum = 0;
  //   for (const item of serviceArray.reverse()) {
  //     // Assuming your Excel sheet has the fields that match your Agency schema
  //     const name = item[0];
  //     //   let findProduct = await Product.findOne({ name });
  //     if (!name || name === "") continue;
  //     autoNum++;
  //     const serviceData = {
  //       service_id: autoNum,
  //       name: item[0] || "",
  //       ad_claim: item[1] && Number(item[1]) ? item[1] : null,
  //       ch_claim: item[2] && Number(item[2]) ? item[2] : null,
  //       cur: item[3] || "",
  //     };

  //     const service = new Service(serviceData);
  //     await service.save(); // Save each item to the database
  //   }
  // }

  // Specify the path to save the JSON file
  const outputFilePath = path.resolve("output.json");

  // Write the JSON data to a file
  fs.writeFileSync(outputFilePath, JSON.stringify(allData, null, 2), "utf-8");

  // Output all data
  console.log("success");
};

export default saveData;
