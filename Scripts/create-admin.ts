import { PrismaClient } from "../generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString = "postgresql://postgres:admin@localhost:5432/PrismaDb?schema=public";
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function createAdminUser() {
  const adminEmail = "admin@demo.com";
  const adminPassword = "admin123";

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log("Admin user already exists:", existingAdmin);
    return;
  }

  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: adminEmail,
      password: adminPassword,
      role: "admin",
    },
  });

  console.log("Admin user created successfully!");
  console.log("Email:", admin.email);
  console.log("Password: admin123");
  console.log("Role:", admin.role);
}

createAdminUser()
  .catch((e) => {
    console.error("Error creating admin user:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
