import { NextResponse } from "next/server";
import { moveCategory } from "@/lib/category-store";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      direction?: "up" | "down";
    };

    const name = body.name?.trim();
    const direction = body.direction;

    if (!name || (direction !== "up" && direction !== "down")) {
      return NextResponse.json(
        { message: "Missing reorder details." },
        { status: 400 },
      );
    }

    const categories = await moveCategory(name, direction);
    return NextResponse.json({ categories });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to reorder categories.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
