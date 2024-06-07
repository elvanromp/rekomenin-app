import { NextRequest, NextResponse } from 'next/server';
import db from '../../config/db';

// Define the GET handler
export async function GET(request: NextRequest) {
  try {
    const id_user = request.nextUrl.searchParams.get('id_user');
    if (!id_user) {
      return NextResponse.json({ message: 'id_user is required' }, { status: 400 });
    }

    const results = await new Promise<any[]>((resolve, reject) => {
      db.query("SELECT learning_path FROM score WHERE id_user = ?", [id_user], (err: any, results: any[]) => {
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
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}

// Define the POST handler
export async function POST(request: NextRequest) {
  try {
    const { id_user, learning_path, preferensi_point } = await request.json();
    console.log(id_user, learning_path, preferensi_point);

    const result = await new Promise<{ insertId: number }>((resolve, reject) => {
      db.query("INSERT INTO score SET ?", { id_user, learning_path, preferensi_point }, (err: any, result: { insertId: number }) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    return NextResponse.json({ id_user, learning_path, preferensi_point, id: result.insertId });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}
