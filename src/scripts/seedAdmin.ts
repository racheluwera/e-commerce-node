import dotenv from "dotenv";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { connectDB } from "../config/database";
import { User } from "../model/User.model";

dotenv.config();

const seedAdmin = async () => {
  const name = process.env.ADMIN_NAME || "Admin";
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env");
    process.exit(1);
  }

  await connectDB();

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await User.findOneAndUpdate(
    { email: email.toLowerCase() },
    {
      $set: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: "admin",
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log(`Admin ready: ${admin.email}`);

  await mongoose.disconnect();
};

seedAdmin().catch(async (error) => {
  console.error("Failed to seed admin:", error);
  await mongoose.disconnect();
  process.exit(1);
});
