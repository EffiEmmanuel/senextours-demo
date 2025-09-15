import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import pool from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { taskId: string } }
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
      `SELECT t.*, 
              u.id as assignee_id, 
              u.name as assignee_name, 
              u.email as assignee_email
       FROM tasks t
       LEFT JOIN users u ON t.assigned_to = u.id
       WHERE t.id = $1`,
      [params.taskId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    const row = result.rows[0];
    const task = {
      id: row.id,
      name: row.name,
      description: row.description,
      tour_id: row.tour_id,
      status: row.status,
      assignedTo: row.assignee_id ? {
        id: row.assignee_id,
        name: row.assignee_name,
        email: row.assignee_email
      } : null,
      created_at: row.created_at,
      updated_at: row.updated_at
    };

    return NextResponse.json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    return NextResponse.json(
      { error: "Failed to fetch task" },
      { status: 500 }
    );
  }
}

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
    const { name, description, assignedTo, status } = body;

    const result = await pool.query(
      `UPDATE tasks 
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           assigned_to = COALESCE($3, assigned_to),
           status = COALESCE($4, status),
           updated_at = NOW()
       WHERE id = $5
       RETURNING *`,
      [name, description, assignedTo, status, params.taskId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    const result = await pool.query(
      "DELETE FROM tasks WHERE id = $1 RETURNING *",
      [params.taskId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}