import { NextResponse } from "next/server";
import { getSprintRows } from "../../../lib/googleSheets";
import { transformData } from "../../../lib/transformData";

export const revalidate = 60;

export async function GET() {
  try {
    const rows = await getSprintRows();

    const data = transformData(rows);

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load sprint data."
      },
      {
        status: 500
      }
    );
  }
}
