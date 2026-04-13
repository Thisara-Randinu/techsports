import { NextResponse } from "next/server";
import { addCategory, getCategories } from "@/lib/category-store";

export async function GET() {
  const categories = await getCategories();
  return NextResponse.json({ categories });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { name?: string };
    const name = body.name?.trim() ?? "";

    if (!name) {
      return NextResponse.json(
        { message: "Category name is required." },
        { status: 400 },
      );
    }

    const categories = await addCategory(name);
    return NextResponse.json({ categories }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to add category.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
