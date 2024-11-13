import { NextResponse } from "next/server";

export async function DELETE() {
  try {
  } catch (error) {
    console.error("error: ", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      {
        status: 500,
      }
    );
  }
}
