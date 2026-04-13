import { defaultProducts, type Product } from "./products";
import { redis } from "./redis-client";

const PRODUCT_KEY = "techsports:products";

export async function getProducts(): Promise<Product[]> {
  if (!redis) {
    return defaultProducts;
  }

  const products = await redis.get<Product[]>(PRODUCT_KEY);
  if (products) {
    return products;
  }

  await redis.set(PRODUCT_KEY, []);
  return [];
}

type ProductInput = Omit<Product, "id" | "createdAt">;

export async function addProduct(input: ProductInput): Promise<Product> {
  if (!redis) {
    throw new Error("Upstash Redis is not configured.");
  }

  const currentProducts = (await redis.get<Product[]>(PRODUCT_KEY)) ?? [];
  const newProduct: Product = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  await redis.set(PRODUCT_KEY, [newProduct, ...currentProducts]);
  return newProduct;
}

export async function updateProduct(
  id: string,
  updates: Partial<ProductInput>,
): Promise<Product> {
  if (!redis) {
    throw new Error("Upstash Redis is not configured.");
  }

  const currentProducts = (await redis.get<Product[]>(PRODUCT_KEY)) ?? [];
  const index = currentProducts.findIndex((product) => product.id === id);

  if (index === -1) {
    throw new Error("Product not found.");
  }

  const updatedProduct: Product = {
    ...currentProducts[index],
    ...updates,
  };

  const updatedProducts = [...currentProducts];
  updatedProducts[index] = updatedProduct;
  await redis.set(PRODUCT_KEY, updatedProducts);

  return updatedProduct;
}

export async function removeProduct(id: string): Promise<void> {
  if (!redis) {
    throw new Error("Upstash Redis is not configured.");
  }

  const currentProducts = (await redis.get<Product[]>(PRODUCT_KEY)) ?? [];
  const updatedProducts = currentProducts.filter(
    (product) => product.id !== id,
  );

  if (updatedProducts.length === currentProducts.length) {
    throw new Error("Product not found.");
  }

  await redis.set(PRODUCT_KEY, updatedProducts);
}

export async function moveProduct(
  id: string,
  direction: "up" | "down",
): Promise<Product[]> {
  if (!redis) {
    throw new Error("Upstash Redis is not configured.");
  }

  const currentProducts = (await redis.get<Product[]>(PRODUCT_KEY)) ?? [];
  const index = currentProducts.findIndex((product) => product.id === id);

  if (index === -1) {
    throw new Error("Product not found.");
  }

  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= currentProducts.length) {
    return currentProducts;
  }

  const updatedProducts = [...currentProducts];
  [updatedProducts[index], updatedProducts[targetIndex]] = [
    updatedProducts[targetIndex],
    updatedProducts[index],
  ];

  await redis.set(PRODUCT_KEY, updatedProducts);
  return updatedProducts;
}

export async function moveProductToPosition(
  id: string,
  position: number,
): Promise<Product[]> {
  if (!redis) {
    throw new Error("Upstash Redis is not configured.");
  }

  const currentProducts = (await redis.get<Product[]>(PRODUCT_KEY)) ?? [];
  const index = currentProducts.findIndex((product) => product.id === id);

  if (index === -1) {
    throw new Error("Product not found.");
  }

  const targetIndex = Math.min(
    Math.max(Math.trunc(position) - 1, 0),
    currentProducts.length - 1,
  );

  if (targetIndex === index) {
    return currentProducts;
  }

  const updatedProducts = [...currentProducts];
  const [movedProduct] = updatedProducts.splice(index, 1);
  updatedProducts.splice(targetIndex, 0, movedProduct);

  await redis.set(PRODUCT_KEY, updatedProducts);
  return updatedProducts;
}
