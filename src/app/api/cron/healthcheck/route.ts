import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export async function GET() {
  try {
    // Perform a simple query to keep the database connection alive
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json(
      { status: "ok", message: "Database connection is active" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database health check failed:", error);
    return NextResponse.json(
      { status: "error", message: "Database health check failed" },
      { status: 500 }
    );
  }
}
