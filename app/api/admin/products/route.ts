import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { addProduct, removeProduct, updateProduct } from "@/lib/product-store";
import { getCategories } from "@/lib/category-store";

function asText(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = asText(formData.get("title"));
    const description = asText(formData.get("description"));
    const range = asText(formData.get("range"));
    const category = asText(formData.get("category"));
    const imageFile = formData.get("image");

    if (!title || !description || !range || !category) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 },
      );
    }

    const categories = await getCategories();
    if (!categories.includes(category)) {
      return NextResponse.json(
        { message: "Invalid category." },
        { status: 400 },
      );
    }

    if (!(imageFile instanceof File) || imageFile.size === 0) {
      return NextResponse.json(
        { message: "A product image is required." },
        { status: 400 },
      );
    }

    const safeName = imageFile.name.replace(/\s+/g, "-").toLowerCase();
    const blob = await put(`products/${Date.now()}-${safeName}`, imageFile, {
      access: "public",
      addRandomSuffix: true,
    });

    const product = await addProduct({
      title,
      description,
      range,
      category,
      image: blob.url,
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to add product.";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const formData = await request.formData();
    const id = asText(formData.get("id"));
    const title = asText(formData.get("title"));
    const description = asText(formData.get("description"));
    const range = asText(formData.get("range"));
    const category = asText(formData.get("category"));
    const imageFile = formData.get("image");

    if (!id || !title || !description || !range || !category) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 },
      );
    }

    const categories = await getCategories();
    if (!categories.includes(category)) {
      return NextResponse.json(
        { message: "Invalid category." },
        { status: 400 },
      );
    }

    let imageUrl: string | undefined;
    if (imageFile instanceof File && imageFile.size > 0) {
      const safeName = imageFile.name.replace(/\s+/g, "-").toLowerCase();
      const blob = await put(`products/${Date.now()}-${safeName}`, imageFile, {
        access: "public",
        addRandomSuffix: true,
      });
      imageUrl = blob.url;
    }

    const product = await updateProduct(id, {
      title,
      description,
      range,
      category,
      ...(imageUrl ? { image: imageUrl } : {}),
    });

    return NextResponse.json({ product });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to update product.";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = (await request.json()) as { id?: string };
    const id = body.id?.trim();

    if (!id) {
      return NextResponse.json(
        { message: "Missing product id." },
        { status: 400 },
      );
    }

    await removeProduct(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to remove product.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
