import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import 'dotenv/config';

import bcrypt from 'bcrypt';

// ✅ Check if owner exists
export const ownerExists = async (req, res) => {
  try {
    console.log("Checking if owner exists...");
    const owner = await prisma.owner.findFirst({ where: { isDev: false } });
    return res.status(200).json({
      success: true,
      exists: !!owner
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error checking owner"
    });
  }
};

// ✅ Setup (ONLY FIRST TIME)
export const singUp = async (req, res) => {
  try {
    console.log("Received signup request:", req.body);
    console.log("Path of the db file being used:", process.env.DATABASE_URL);
    const existing = await prisma.owner.findFirst({ where: { isDev: false } });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Owner already exists"
      });
    }

    const { userName, password, cnfpassword } = req.body;

    if (!userName || !password || !cnfpassword) {
      return res.status(400).json({
        success: false,
        message: "All fields required"
      });
    }

    if (password !== cnfpassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match"
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    await prisma.owner.create({
      data: {
        userName: userName,
        password: hashed
      }
    });

    return res.status(200).json({
      success: true,
      message: "Owner created"
    });

  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({
      success: false,
      message: "Setup failed"
    });
  }
};

// ✅ Login
// This authenticates any owner stored in the database, including a manually created developer owner.
export const signIn = async (req, res) => {
  try {
    const { userName, password } = req.body;
    console.log("Received login request for user:", userName);
    const owner = await prisma.owner.findUnique({
      where: { userName: userName }
    });

    if (!owner) {
      return res.status(404).json({
        success: false,
        message: "Owner not found"
      });
    }

    const match = await bcrypt.compare(password, owner.password);

    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login success"
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Login error"
    });
  }
};