import { NextResponse } from "next/server";
import { getSprintTasks } from "../../../lib/googleSheets";

export async function GET() {
  try {
    const tasks = await getSprintTasks();

    return NextResponse.json({
      success: true,
      tasks,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      tasks: [],
    });
  }
}