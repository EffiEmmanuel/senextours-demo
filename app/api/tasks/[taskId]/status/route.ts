import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import pool from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { taskId: string } }
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
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `UPDATE tasks 
       SET status = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [status, params.taskId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating task status:", error);
    return NextResponse.json(
      { error: "Failed to update task status" },
      { status: 500 }
    );
  }
}