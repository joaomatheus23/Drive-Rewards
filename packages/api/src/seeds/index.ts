import { loadDotenv } from "../config/load-dotenv.js";
loadDotenv();

import bcrypt from "bcryptjs";
import { connectDatabase, disconnectDatabase } from "../config/database.js";
import { loadEnv } from "../config/env.js";
import { User, Partner, Coupon } from "../models/index.js";

/** Seed development database with sample Winnipeg data */
async function seed(): Promise<void> {
  const env = loadEnv();
  await connectDatabase(env);

  console.log("[seed] Clearing existing data...");
  await Promise.all([User.deleteMany({}), Partner.deleteMany({}), Coupon.deleteMany({})]);

  const passwordHash = await bcrypt.hash("password123", 12);

  const users = await User.create([
    {
      name: "Admin User",
      email: "admin@drivenrewards.ca",
      passwordHash,
      role: "super_admin",
      points: 0,
    },
    {
      name: "John Driver",
      email: "driver@example.com",
      passwordHash,
      role: "driver",
      points: 2500,
      level: "silver",
      vehicle: { make: "Honda", model: "Civic", year: 2021 },
    },
    {
      name: "Maria Owner",
      email: "owner@cafe.example.com",
      passwordHash,
      role: "partner_owner",
      points: 0,
    },
  ]);

  const owner = users[2]!;
  void users[0];
  void users[1];

  const partner = await Partner.create({
    name: "The Forks Cafe",
    slug: "the-forks-cafe",
    email: "info@forkscafe.example.com",
    address: {
      street: "1 Forks Market Rd",
      city: "Winnipeg",
      province: "MB",
      postalCode: "R3C 4L9",
      country: "CA",
    },
    location: { type: "Point", coordinates: [-97.1312, 49.8872] },
    geofence: {
      center: { type: "Point", coordinates: [-97.1312, 49.8872] },
      radiusMeters: 500,
    },
    plan: "premium",
    commissionRate: 10,
    ownerId: owner._id,
    isActive: true,
  });

  await User.findByIdAndUpdate(owner._id, { partnerId: partner._id });

  await Coupon.create({
    partnerId: partner._id,
    title: "20% off any drink",
    type: "percentage",
    value: 20,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    redemptionLimit: 100,
    isActive: true,
  });

  console.log("[seed] Done.");
  console.log(`  Admin:  admin@drivenrewards.ca / password123`);
  console.log(`  Driver: driver@example.com / password123`);
  console.log(`  Owner:  owner@cafe.example.com / password123`);

  await disconnectDatabase();
}

seed().catch((err) => {
  console.error("[seed] Failed:", err);
  process.exit(1);
});
