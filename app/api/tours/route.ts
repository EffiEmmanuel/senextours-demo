import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import pool from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    let query = "SELECT * FROM tours";
    const params: any[] = [];

    // If userId is provided and user is not admin, filter by created_by
    if (userId && session.user.role !== "admin") {
      query += " WHERE created_by = $1";
      params.push(userId);
    }

    query += " ORDER BY created_at DESC";

    const result = await pool.query(query, params);
    
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching tours:", error);
    return NextResponse.json(
      { error: "Failed to fetch tours" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, description, date, status } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Tour name is required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO tours (name, description, date, status, created_by, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING *`,
      [name, description, date, status || "pending", session.user.id]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error creating tour:", error);
    return NextResponse.json(
      { error: "Failed to create tour" },
      { status: 500 }
    );
  }
}