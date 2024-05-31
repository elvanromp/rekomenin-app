import { NextResponse } from "next/server";
import db from "../../config/db";

export async function GET() {
  try {
    const results = await new Promise((resolve, reject) => {
      db.query("SELECT * FROM courses", (err: any, results: []) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
    console.log(results);
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      { message: error },
      { status: 500 }
    );
  }
}

interface InsertResult {
  insertId: number;
  affectedRows: number;
  // Add other properties if necessary
}

export async function POST(request: Request) {
  try {
    // Parse the JSON body of the request
    const body = await request.json();
    
    // Destructure the fields you expect from the body
    const { 
      name, 
      description, 
      technology, 
      hours_to_study, 
      rating, 
      level, 
      learning_path, 
      total_modules, 
      registered_students 
    } = body;

    // Check if all required fields are provided
    if (
      !name || 
      !description || 
      !technology || 
      hours_to_study == null || 
      rating == null || 
      !level || 
      !learning_path || 
      total_modules == null || 
      registered_students == null
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert the new course into the database
    const result: InsertResult = await new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO courses (name, description, technology, hours_to_study, rating, level, learning_path, total_modules, registered_students) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [name, description, technology, hours_to_study, rating, level, learning_path, total_modules, registered_students],
        (err: any, result: InsertResult) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });

    // Return the response with the newly created course ID
    return NextResponse.json(
      { message: "Course inserted successfully", courseId: result.insertId },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error },
      { status: 500 }
    );
  }
}