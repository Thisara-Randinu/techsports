import { NextResponse } from "next/server";
import { moveProduct, moveProductToPosition } from "@/lib/product-store";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      id?: string;
      direction?: "up" | "down";
      position?: number;
    };

    const id = body.id?.trim();
    const direction = body.direction;
    const position = body.position;

    if (
      !id ||
      (direction !== "up" &&
        direction !== "down" &&
        typeof position !== "number")
    ) {
      return NextResponse.json(
        { message: "Missing reorder details." },
        { status: 400 },
      );
    }

    const products =
      typeof position === "number"
        ? await moveProductToPosition(id, position)
        : await moveProduct(id, direction as "up" | "down");
    return NextResponse.json({ products });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to reorder products.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
