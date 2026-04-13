import { productCategories } from "./products";
import { redis } from "./redis-client";

const CATEGORY_KEY = "techsports:categories";

function normalizeCategoryName(name: string) {
  return name.trim().replace(/\s+/g, " ");
}

export async function getCategories(): Promise<string[]> {
  if (!redis) {
    return productCategories;
  }

  const categories = await redis.get<string[]>(CATEGORY_KEY);
  if (categories && categories.length > 0) {
    return categories;
  }

  await redis.set(CATEGORY_KEY, productCategories);
  return productCategories;
}

export async function addCategory(name: string): Promise<string[]> {
  if (!redis) {
    throw new Error("Upstash Redis is not configured.");
  }

  const normalized = normalizeCategoryName(name);
  if (!normalized) {
    throw new Error("Category name is required.");
  }

  const currentCategories =
    (await redis.get<string[]>(CATEGORY_KEY)) ?? productCategories;
  const exists = currentCategories.some(
    (category) => category.toLowerCase() === normalized.toLowerCase(),
  );

  if (exists) {
    throw new Error("Category already exists.");
  }

  const updatedCategories = [...currentCategories, normalized];
  await redis.set(CATEGORY_KEY, updatedCategories);
  return updatedCategories;
}

export async function moveCategory(
  name: string,
  direction: "up" | "down",
): Promise<string[]> {
  if (!redis) {
    throw new Error("Upstash Redis is not configured.");
  }

  const currentCategories =
    (await redis.get<string[]>(CATEGORY_KEY)) ?? productCategories;
  const index = currentCategories.findIndex(
    (category) => category.toLowerCase() === name.toLowerCase(),
  );

  if (index === -1) {
    throw new Error("Category not found.");
  }

  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= currentCategories.length) {
    return currentCategories;
  }

  const updatedCategories = [...currentCategories];
  [updatedCategories[index], updatedCategories[targetIndex]] = [
    updatedCategories[targetIndex],
    updatedCategories[index],
  ];

  await redis.set(CATEGORY_KEY, updatedCategories);
  return updatedCategories;
}
