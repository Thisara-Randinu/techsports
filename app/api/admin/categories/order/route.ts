import { NextResponse } from "next/server";
import {
  moveCategory,
  moveCategoryToPosition,
  removeCategory,
} from "@/lib/category-store";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      direction?: "up" | "down";
      position?: number;
      action?: "move" | "delete";
    };

    const name = body.name?.trim();
    const direction = body.direction;
    const position = body.position;
    const action = body.action ?? "move";

    if (!name) {
      return NextResponse.json(
        { message: "Missing reorder details." },
        { status: 400 },
      );
    }

    if (action === "delete") {
      const categories = await removeCategory(name);
      return NextResponse.json({ categories });
    }

    if (
      direction !== "up" &&
      direction !== "down" &&
      typeof position !== "number"
    ) {
      return NextResponse.json(
        { message: "Missing reorder details." },
        { status: 400 },
      );
    }

    const categories =
      typeof position === "number"
        ? await moveCategoryToPosition(name, position)
        : await moveCategory(name, direction as "up" | "down");
    return NextResponse.json({ categories });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to reorder categories.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
