import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import pool from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { tourId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const result = await pool.query(
      "SELECT * FROM tours WHERE id = $1",
      [params.tourId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Tour not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching tour:", error);
    return NextResponse.json(
      { error: "Failed to fetch tour" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { tourId: string } }
) {
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

    const result = await pool.query(
      `UPDATE tours 
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           date = COALESCE($3, date),
           status = COALESCE($4, status),
           updated_at = NOW()
       WHERE id = $5
       RETURNING *`,
      [name, description, date, status, params.tourId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Tour not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating tour:", error);
    return NextResponse.json(
      { error: "Failed to update tour" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { tourId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // First delete all tasks associated with this tour
    await pool.query("DELETE FROM tasks WHERE tour_id = $1", [params.tourId]);
    
    // Then delete the tour
    const result = await pool.query(
      "DELETE FROM tours WHERE id = $1 RETURNING *",
      [params.tourId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Tour not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Tour deleted successfully" });
  } catch (error) {
    console.error("Error deleting tour:", error);
    return NextResponse.json(
      { error: "Failed to delete tour" },
      { status: 500 }
    );
  }
}