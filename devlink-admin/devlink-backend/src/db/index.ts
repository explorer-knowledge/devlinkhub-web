import prisma from "./prismaInstance.js";

async function connectDB(): Promise<void> {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");
  } catch (error: any) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
}

export default connectDB;
