import XLSX from "xlsx";
import { PrismaClient, Prisma } from "@prisma/client";
import iconv from "iconv-lite";
import fs, { existsSync } from "fs";
import "dotenv/config";

const prisma = new PrismaClient();
import Papa from "papaparse";
import { scryptSync } from "crypto";

// ── Field Mapping ─────────────────────────────────────────────────────────────
const fieldMapping = {
  Timestamp: "date",
  "Name of the Applicant": "name",
  "Father's Name / Mother's Name": "guardianName",
  "Are you curently invloved in any physical activity or Sports": "involvedInSports",
  "As any disciplinary action taken or pending against you": "disciplineStatus",
  "Biceps (Inch)": "biceps",
  "Calf (Inch)": "calf",
  "Chest (Inch)": "chest",
  "Class: Student | Category: Staff": "category",
  "Date of Birth": "DOB",
  "Diet Preference": "dietPreference",
  "Do you have any Diseases or Medical Conditions": "medicalConditions",
  "Email ID": "email",
  "Enrolment No. / Employee ID": "enrollmentId",
  "Experience Level": "experienceLevel",
  "Height (Inch)": "height",
  "Purpose of Joining": "purpose",
  "Recent Photograph": "photoUrl",
  'Student: "Hall" | Staff: "Department" | Rest: "Address"': "address",
  "Thigh (Inch)": "thigh",
  "Upload - University ID Card / Bonafide Certificate / Continution Slip (2025-2026)": "idCardUrl",
  "Waist (Inch)": "waist",
  "Weight (Kgs)": "weight",
  "Whatsapp / Mobile Number": "whatsAppNumber",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const toStr = (val) => {
  if (val === null || val === undefined || val === "") return "";
  if (val instanceof Date) return val.toLocaleDateString("en-IN");
  return String(val).trim();
};

const transformData = (frontendData, fieldMapping) => {
  let transformedData = {};
  for (let key in frontendData) {
    if (fieldMapping[key] !== undefined) {
      transformedData[fieldMapping[key]] = frontendData[key];
    }
  }
  return transformedData;
};

// ── Parsers ───────────────────────────────────────────────────────────────────

function parseCSV(csvString) {
  return new Promise((resolve, reject) => {
    Papa.parse(csvString, {
      header: true,
      skipEmptyLines: true,
      delimiter: ",",
      complete: (result) => {
        console.log("CSV parsed successfully");
        resolve(result);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}

function parseXLSX(filePath) {
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(sheet, { defval: "", raw: false });
}

// ── Controller ────────────────────────────────────────────────────────────────

async function createUser(req, res) {
  try {
    // ── 1. Check file exists ────────────────────────────────────────────────
    const file = req.files?.file;
    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    // ── 2. Check temp file is readable ──────────────────────────────────────
    if (!existsSync(file.tempFilePath)) {
      return res.status(400).json({
        success: false,
        message: "Uploaded file could not be read. Please try again.",
      });
    }

    // ── 3. Validate file type ───────────────────────────────────────────────
    const fileName = file.name.toLowerCase();
    const isCSV = fileName.endsWith(".csv");
    const isXLSX = fileName.endsWith(".xlsx");

    if (!isCSV && !isXLSX) {
      return res.status(400).json({
        success: false,
        message: "Invalid file type. Only .csv and .xlsx files are supported.",
      });
    }

    // ── 4. Parse file ───────────────────────────────────────────────────────
    let data;
    try {
      if (isXLSX) {
        data = parseXLSX(file.tempFilePath);
      } else {
        const csvString = iconv.decode(fs.readFileSync(file.tempFilePath), "utf8");
        const parsed = await parseCSV(csvString);
        data = parsed.data;
      }
    } catch (err) {
      console.error("File parsing error:", err.message);
      return res.status(400).json({
        success: false,
        message: "Failed to parse file: " + err.message,
      });
    }

    // ── 5. Check file is not empty ──────────────────────────────────────────
    if (!data || data.length === 0) {
      return res.status(400).json({
        success: false,
        message: "File is empty or has no valid rows.",
      });
    }

    // ── 6. Process each row ─────────────────────────────────────────────────
    const skipped = [];

    for (let i = 0; i < data.length; i++) {
      const raw = transformData(data[i], fieldMapping);

      try {
        await prisma.user.create({
          data: {
            // ── Mandatory fields (String — never null) ──
            name:              toStr(raw.name),
            guardianName:      toStr(raw.guardianName),
            enrollmentId:      toStr(raw.enrollmentId).toUpperCase(),
            email:             toStr(raw.email),
            whatsAppNumber:    toStr(raw.whatsAppNumber),
            experienceLevel:   toStr(raw.experienceLevel),
            height:            toStr(raw.height),
            weight:            toStr(raw.weight),
            chest:             toStr(raw.chest),
            biceps:            toStr(raw.biceps),
            thigh:             toStr(raw.thigh),
            waist:             toStr(raw.waist),
            calf:              toStr(raw.calf),
            medicalConditions: toStr(raw.medicalConditions),

            // ── Optional fields (String? — null if empty) ──
            date:             toStr(raw.date)             || null,
            DOB:              toStr(raw.DOB)              || null,
            address:          toStr(raw.address)          || null,
            category:         toStr(raw.category)         || null,
            purpose:          toStr(raw.purpose)          || null,
            dietPreference:   toStr(raw.dietPreference)   || null,
            involvedInSports: toStr(raw.involvedInSports) || null,
            disciplineStatus: toStr(raw.disciplineStatus) || null,
            photoUrl:         toStr(raw.photoUrl)         || null,
            idCardUrl:        toStr(raw.idCardUrl)        || null,
          },
        });

        await prisma.userSplit.create({
          data: {
            userId: toStr(raw.enrollmentId).toUpperCase(),
          },
        });

      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          skipped.push(toStr(raw.enrollmentId) || `row ${i + 1}`);
          continue;
        } else {
          return res.status(400).json({
            success: false,
            message: `Row ${i + 1} (${toStr(raw.name)}): ${error.message}`,
          });
        }
      }
    }

    // ── 7. Return result ────────────────────────────────────────────────────
    return res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      skipped:
        skipped.length > 0
          ? `${skipped.length} duplicate(s) skipped: ${skipped.join(", ")}`
          : "No duplicates found",
    });

  } catch (error) {
    console.error("Error in createUser:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}


//===================================================== Get All users =================================//

async function getAllUsers(req, res) {
  try {
    const users = await prisma.user.findMany({});
    // console.log("Hey i am here ")
    if(!users){
      return res.status(404).json({
        success:false,
        message:"No data found"
      })
    }

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error while getting the users",
    });
  }
}

async function getSingleUser(req,res) {
  try{
    const {enrollmentId}=req.body;
    const user=await prisma.user.findFirst({
      where:{enrollmentId:enrollmentId}
    })
    if(!user){
      return res.status(404).json({
        success:false,
        message:"No data found"
      })
    }
    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: user,
    });
  }
  catch(err){
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Internal server error while getting the single User",
    });
  }
}

const updateMemberDetail=async(req,res)=>{
  try{
    const userId=req.body.userId;
    const data=req.body.data;
    if(!userId || !data){
      return res.status(402).json({
        success:false,
        data:"All fields are required"
      })
    }
    const parsedData=JSON.parse(data);
    const response=await prisma.user.update({
      where: { enrollmentId:userId },
      data: {
        ...parsedData
      }
    });

    return res.status(200).json({
      success:true,
      message:"Data is updated"
    })

  }
  catch(err){
    return res.status(500).json({
      success:false,
      message:"Some error in updating data"
    })
  }
}

//===================================================== Delete User =================================//

const deleteUser = async(req,res) => {
  try{
    const { enrollmentId } = req.body;
    
    if(!enrollmentId){
      return res.status(402).json({
        success:false,
        message:"Enrollment ID is required"
      })
    }

    const user = await prisma.user.delete({
      where: { enrollmentId: enrollmentId }
    });

    return res.status(200).json({
      success:true,
      message:"User deleted successfully",
      data: user
    })
  }
  catch(err){
    if(err.code === "P2025"){
      return res.status(404).json({
        success:false,
        message:"User not found"
      })
    }
    console.log(err);
    return res.status(500).json({
      success:false,
      message:"Some error in deleting user"
    })
  }
}

export { createUser, getAllUsers, getSingleUser, updateMemberDetail, deleteUser };