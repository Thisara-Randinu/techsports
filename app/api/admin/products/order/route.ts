import { NextResponse } from "next/server";
import { moveProduct } from "@/lib/product-store";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      id?: string;
      direction?: "up" | "down";
    };

    const id = body.id?.trim();
    const direction = body.direction;

    if (!id || (direction !== "up" && direction !== "down")) {
      return NextResponse.json(
        { message: "Missing reorder details." },
        { status: 400 },
      );
    }

    const products = await moveProduct(id, direction);
    return NextResponse.json({ products });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to reorder products.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
