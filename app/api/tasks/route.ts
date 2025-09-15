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
    const tourId = searchParams.get("tourId");

    let query = `
      SELECT t.*, 
             u.id as assignee_id, 
             u.name as assignee_name, 
             u.email as assignee_email
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
    `;
    const params: any[] = [];

    if (tourId) {
      query += " WHERE t.tour_id = $1";
      params.push(tourId);
    }

    query += " ORDER BY t.created_at DESC";

    const result = await pool.query(query, params);
    
    // Transform the result to match the expected format
    const tasks = result.rows.map(row => ({
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
    }));
    
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
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
    const { name, description, tour_id, assignedTo, status } = body;

    if (!name || !tour_id) {
      return NextResponse.json(
        { error: "Task name and tour ID are required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO tasks (name, description, tour_id, assigned_to, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING *`,
      [name, description, tour_id, assignedTo || null, status || "To-Do"]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}