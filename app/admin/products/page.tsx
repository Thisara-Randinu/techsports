"use client";

import Image from "next/image";
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useThemeMode } from "@/app/ThemeRegistry";
import { type Product } from "@/lib/products";

type Status = {
  type: "success" | "error";
  message: string;
} | null;

type FormState = {
  title: string;
  description: string;
  range: string;
  category: string;
};

function resolveProductImageSrc(image: string) {
  if (image.startsWith("/api/blob?")) {
    return image;
  }

  try {
    const url = new URL(image);
    if (url.hostname.includes(".private.blob.vercel-storage.com")) {
      return `/api/blob?pathname=${encodeURIComponent(url.pathname.slice(1))}`;
    }
  } catch {
    // Keep non-URL values as-is.
  }

  return image;
}

const emptyForm: FormState = {
  title: "",
  description: "",
  range: "",
  category: "",
};

export default function AdminProductsPage() {
  const { mode } = useThemeMode();
  const isDark = mode === "dark";
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [reorderingProductId, setReorderingProductId] = useState<string | null>(
    null,
  );
  const [reorderingProductPosition, setReorderingProductPosition] = useState<
    Record<string, string>
  >({});
  const [reorderingCategoryName, setReorderingCategoryName] = useState<
    string | null
  >(null);
  const [reorderingCategoryPosition, setReorderingCategoryPosition] = useState<
    Record<string, string>
  >({});
  const [deletingCategoryName, setDeletingCategoryName] = useState<
    string | null
  >(null);
  const [formState, setFormState] = useState<FormState>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>(null);

  const loadProducts = useCallback(async () => {
    setIsLoadingProducts(true);
    try {
      const response = await fetch("/api/products", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Unable to load products.");
      }

      const data = (await response.json()) as { products?: Product[] };
      const loadedProducts = data.products ?? [];
      setProducts(loadedProducts);
      setReorderingProductPosition({});
      if (categories.length === 0) {
        const derivedCategories = Array.from(
          new Set(loadedProducts.map((product) => product.category)),
        );
        setCategories(derivedCategories);
      }
    } catch {
      setStatus({
        type: "error",
        message: "Failed to load current products.",
      });
    } finally {
      setIsLoadingProducts(false);
    }
  }, [categories.length]);

  const loadCategories = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/categories", {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error("Unable to load categories.");
      }

      const data = (await response.json()) as { categories?: string[] };
      setCategories(data.categories ?? []);
      setReorderingCategoryPosition({});
    } catch {
      // Fallback to categories derived from products.
    }
  }, []);

  useEffect(() => {
    void Promise.all([loadProducts(), loadCategories()]);
  }, [loadCategories, loadProducts]);

  function resetForm() {
    setEditingProductId(null);
    setFormState(emptyForm);
    setImageFile(null);
  }

  async function handleAddCategory() {
    const name = newCategory.trim();
    if (!name) {
      setStatus({ type: "error", message: "Enter a category name first." });
      return;
    }

    setIsAddingCategory(true);
    setStatus(null);

    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = (await response.json()) as {
        categories?: string[];
        message?: string;
      };

      if (!response.ok) {
        throw new Error(data.message ?? "Failed to add category.");
      }

      setCategories(data.categories ?? categories);
      setNewCategory("");
      setFormState((prev) => ({ ...prev, category: name }));
      setStatus({ type: "success", message: "Category added successfully." });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error ? error.message : "Failed to add category.",
      });
    } finally {
      setIsAddingCategory(false);
    }
  }

  function handleInputChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  }

  function startEditing(product: Product) {
    setEditingProductId(product.id ?? null);
    setFormState({
      title: product.title,
      description: product.description,
      range: product.range ?? "",
      category: product.category,
    });
    setImageFile(null);
    setStatus(null);
  }

  async function handleDelete(id?: string) {
    if (!id) {
      setStatus({ type: "error", message: "This product cannot be removed." });
      return;
    }

    const shouldDelete = window.confirm(
      "Remove this product from the catalog?",
    );
    if (!shouldDelete) return;

    try {
      const response = await fetch("/api/admin/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = (await response.json()) as { message?: string };
      if (!response.ok) {
        throw new Error(data.message ?? "Failed to remove product.");
      }

      setStatus({ type: "success", message: "Product removed successfully." });
      await loadProducts();
      if (editingProductId === id) {
        resetForm();
      }
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error ? error.message : "Failed to remove product.",
      });
    }
  }

  async function handleMoveProduct(
    id: string | undefined,
    direction: "up" | "down",
  ) {
    if (!id) return;

    setReorderingProductId(id);
    setStatus(null);

    try {
      const response = await fetch("/api/admin/products/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, direction }),
      });

      const data = (await response.json()) as {
        message?: string;
        products?: Product[];
      };

      if (!response.ok) {
        throw new Error(data.message ?? "Failed to reorder product.");
      }

      setProducts(data.products ?? []);
      setStatus({
        type: "success",
        message: "Product order updated successfully.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error ? error.message : "Failed to reorder product.",
      });
    } finally {
      setReorderingProductId(null);
    }
  }

  async function handleSetProductPosition(
    id: string | undefined,
    index: number,
  ) {
    if (!id) return;

    const value = reorderingProductPosition[id]?.trim();
    const position = Number(value);
    if (!Number.isInteger(position) || position < 1) {
      setStatus({ type: "error", message: "Enter a valid product position." });
      return;
    }

    setReorderingProductId(id);
    setStatus(null);

    try {
      const response = await fetch("/api/admin/products/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, position }),
      });

      const data = (await response.json()) as {
        message?: string;
        products?: Product[];
      };

      if (!response.ok) {
        throw new Error(data.message ?? "Failed to reorder product.");
      }

      setProducts(data.products ?? []);
      setReorderingProductPosition({});
      setStatus({
        type: "success",
        message: "Product order updated successfully.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error ? error.message : "Failed to reorder product.",
      });
    } finally {
      setReorderingProductId(null);
    }
  }

  async function handleMoveCategory(name: string, direction: "up" | "down") {
    setReorderingCategoryName(name);
    setStatus(null);

    try {
      const response = await fetch("/api/admin/categories/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, direction }),
      });

      const data = (await response.json()) as {
        message?: string;
        categories?: string[];
      };

      if (!response.ok) {
        throw new Error(data.message ?? "Failed to reorder category.");
      }

      setCategories(data.categories ?? []);
      setStatus({
        type: "success",
        message: "Category order updated successfully.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to reorder category.",
      });
    } finally {
      setReorderingCategoryName(null);
    }
  }

  async function handleSetCategoryPosition(name: string, index: number) {
    const value = reorderingCategoryPosition[name]?.trim();
    const position = Number(value);
    if (!Number.isInteger(position) || position < 1) {
      setStatus({ type: "error", message: "Enter a valid category position." });
      return;
    }

    setReorderingCategoryName(name);
    setStatus(null);

    try {
      const response = await fetch("/api/admin/categories/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, position }),
      });

      const data = (await response.json()) as {
        message?: string;
        categories?: string[];
      };

      if (!response.ok) {
        throw new Error(data.message ?? "Failed to reorder category.");
      }

      setCategories(data.categories ?? []);
      setReorderingCategoryPosition({});
      setStatus({
        type: "success",
        message: "Category order updated successfully.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to reorder category.",
      });
    } finally {
      setReorderingCategoryName(null);
    }
  }

  async function handleDeleteCategory(name: string) {
    const productUsesCategory = products.some(
      (product) => product.category.toLowerCase() === name.toLowerCase(),
    );

    if (productUsesCategory) {
      setStatus({
        type: "error",
        message: "Delete products in this category before removing it.",
      });
      return;
    }

    const shouldDelete = window.confirm(`Delete category \"${name}\"?`);
    if (!shouldDelete) return;

    setDeletingCategoryName(name);
    setStatus(null);

    try {
      const response = await fetch("/api/admin/categories/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, action: "delete" }),
      });

      const data = (await response.json()) as {
        message?: string;
        categories?: string[];
      };

      if (!response.ok) {
        throw new Error(data.message ?? "Failed to delete category.");
      }

      setCategories(data.categories ?? []);
      setStatus({ type: "success", message: "Category deleted successfully." });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error ? error.message : "Failed to delete category.",
      });
    } finally {
      setDeletingCategoryName(null);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    const formData = new FormData();
    formData.set("title", formState.title.trim());
    formData.set("description", formState.description.trim());
    formData.set("range", formState.range.trim());
    formData.set("category", formState.category.trim());
    if (imageFile) {
      formData.set("image", imageFile);
    }

    if (!editingProductId && !imageFile) {
      setStatus({ type: "error", message: "Please select an image." });
      setIsSubmitting(false);
      return;
    }

    if (!formState.category.trim()) {
      setStatus({ type: "error", message: "Please select a category." });
      setIsSubmitting(false);
      return;
    }

    if (editingProductId) {
      formData.set("id", editingProductId);
    }

    try {
      const response = await fetch("/api/admin/products", {
        method: editingProductId ? "PATCH" : "POST",
        body: formData,
      });

      const data = (await response.json()) as { message?: string };
      if (!response.ok) {
        throw new Error(
          data.message ??
            (editingProductId
              ? "Failed to update product."
              : "Failed to create product."),
        );
      }

      setStatus({
        type: "success",
        message: editingProductId
          ? "Product updated successfully."
          : "Product created successfully.",
      });
      resetForm();
      await Promise.all([loadProducts(), loadCategories()]);
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : editingProductId
              ? "Failed to update product."
              : "Failed to create product.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main
      className={`relative isolate min-h-screen transition-colors duration-300 ${
        isDark ? "bg-[#0f1514] text-[#edf3ef]" : "bg-[#f5f6f2] text-[#18201f]"
      }`}
    >
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: isDark
              ? "radial-gradient(circle at 20% 20%, rgba(63, 87, 80, 0.2), transparent 45%), radial-gradient(circle at 80% 10%, rgba(59, 78, 113, 0.22), transparent 42%)"
              : "radial-gradient(circle at 20% 20%, rgba(216, 238, 203, 0.45), transparent 45%), radial-gradient(circle at 80% 10%, rgba(201, 217, 247, 0.45), transparent 42%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-10">
        <h1 className="text-3xl font-semibold sm:text-4xl">
          Product Management
        </h1>
        <p
          className={`mt-3 text-sm ${isDark ? "text-[#c1d0cc]" : "text-[#3f4a48]"}`}
        >
          Add new products, update existing entries, or remove products from the
          catalog.
        </p>

        <section
          className={`mt-8 rounded-2xl border p-6 backdrop-blur ${
            isDark
              ? "border-white/15 bg-white/5"
              : "border-[#18201f]/10 bg-white/80"
          }`}
        >
          <h2 className="text-xl font-semibold">
            {editingProductId ? "Edit Product" : "Add Product"}
          </h2>

          <form onSubmit={handleSubmit} className="mt-5 space-y-5">
            <div>
              <label htmlFor="title" className="mb-2 block text-sm font-medium">
                Product Title
              </label>
              <input
                id="title"
                name="title"
                required
                value={formState.title}
                onChange={handleInputChange}
                className={`w-full rounded-lg border px-3 py-2 text-sm ${
                  isDark
                    ? "border-white/20 bg-[#15201e] text-white"
                    : "border-neutral-300 bg-white text-[#18201f]"
                }`}
                placeholder="e.g. Sprint Pro Trainers"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={formState.description}
                onChange={handleInputChange}
                className={`w-full rounded-lg border px-3 py-2 text-sm ${
                  isDark
                    ? "border-white/20 bg-[#15201e] text-white"
                    : "border-neutral-300 bg-white text-[#18201f]"
                }`}
                placeholder="Explain what makes this product useful"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="range"
                  className="mb-2 block text-sm font-medium"
                >
                  Price Range (optional)
                </label>
                <input
                  id="range"
                  name="range"
                  value={formState.range}
                  onChange={handleInputChange}
                  className={`w-full rounded-lg border px-3 py-2 text-sm ${
                    isDark
                      ? "border-white/20 bg-[#15201e] text-white"
                      : "border-neutral-300 bg-white text-[#18201f]"
                  }`}
                  placeholder="e.g. $45 - $120"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-medium"
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formState.category}
                  onChange={handleInputChange}
                  className={`w-full rounded-lg border px-3 py-2 text-sm ${
                    isDark
                      ? "border-white/20 bg-[#15201e] text-white"
                      : "border-neutral-300 bg-white text-[#18201f]"
                  }`}
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <div className="mt-3 flex gap-2">
                  <input
                    value={newCategory}
                    onChange={(event) => setNewCategory(event.target.value)}
                    placeholder="Add new category"
                    className={`w-full rounded-lg border px-3 py-2 text-sm ${
                      isDark
                        ? "border-white/20 bg-[#15201e] text-white"
                        : "border-neutral-300 bg-white text-[#18201f]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    disabled={isAddingCategory}
                    className={`rounded-full px-4 py-2 text-sm font-medium text-white disabled:opacity-60 ${
                      isDark ? "bg-[#5f7f77]" : "bg-[#18201f]"
                    }`}
                  >
                    {isAddingCategory ? "Adding..." : "Add"}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="image" className="mb-2 block text-sm font-medium">
                Product Image {editingProductId ? "(optional)" : ""}
              </label>
              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={(event) =>
                  setImageFile(event.target.files?.[0] ?? null)
                }
                className={`w-full rounded-lg border px-3 py-2 text-sm ${
                  isDark
                    ? "border-white/20 bg-[#15201e] text-white"
                    : "border-neutral-300 bg-white text-[#18201f]"
                }`}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`rounded-full px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60 ${
                  isDark ? "bg-[#5f7f77]" : "bg-[#18201f]"
                }`}
              >
                {isSubmitting
                  ? "Saving..."
                  : editingProductId
                    ? "Update Product"
                    : "Save Product"}
              </button>

              {editingProductId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className={`rounded-full border px-5 py-2.5 text-sm font-medium ${
                    isDark
                      ? "border-white/30 text-white hover:bg-white/10"
                      : "border-[#18201f]/25 text-[#18201f] hover:bg-[#18201f]/5"
                  }`}
                >
                  Cancel Edit
                </button>
              )}
            </div>

            {status && (
              <p
                className={`text-sm ${status.type === "success" ? "text-green-600" : "text-red-600"}`}
              >
                {status.message}
              </p>
            )}
          </form>
        </section>

        <section
          className={`mt-8 rounded-2xl border p-6 backdrop-blur ${
            isDark
              ? "border-white/15 bg-white/5"
              : "border-[#18201f]/10 bg-white/80"
          }`}
        >
          <h2 className="text-xl font-semibold">Category Order</h2>
          <p
            className={`mt-2 text-sm ${isDark ? "text-[#a3b4b0]" : "text-[#4f5d5b]"}`}
          >
            Use the arrows or enter a number to control the order shown on the
            home page.
          </p>

          <div className="mt-4 space-y-2">
            {categories.map((category, index) => (
              <div
                key={category}
                className={`flex flex-col gap-3 rounded-xl border px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${
                  isDark
                    ? "border-white/10 bg-[#15201e]"
                    : "border-[#18201f]/10 bg-white"
                }`}
              >
                <span className="text-sm font-medium">{category}</span>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={categories.length}
                    value={
                      reorderingCategoryPosition[category] ?? String(index + 1)
                    }
                    onChange={(event) =>
                      setReorderingCategoryPosition((prev) => ({
                        ...prev,
                        [category]: event.target.value,
                      }))
                    }
                    className={`w-20 rounded-full border px-3 py-1.5 text-xs ${
                      isDark
                        ? "border-white/20 bg-[#0f1514] text-white"
                        : "border-[#18201f]/20 bg-white text-[#18201f]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => handleSetCategoryPosition(category, index)}
                    disabled={reorderingCategoryName === category}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium disabled:opacity-50 ${
                      isDark
                        ? "bg-[#5f7f77] text-white"
                        : "bg-[#18201f] text-white"
                    }`}
                  >
                    Set
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveCategory(category, "up")}
                    disabled={
                      index === 0 || reorderingCategoryName === category
                    }
                    className={`rounded-full px-3 py-1.5 text-xs font-medium disabled:opacity-50 ${
                      isDark
                        ? "bg-[#5f7f77] text-white"
                        : "bg-[#18201f] text-white"
                    }`}
                  >
                    Up
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveCategory(category, "down")}
                    disabled={
                      index === categories.length - 1 ||
                      reorderingCategoryName === category
                    }
                    className={`rounded-full px-3 py-1.5 text-xs font-medium disabled:opacity-50 ${
                      isDark
                        ? "bg-[#5f7f77] text-white"
                        : "bg-[#18201f] text-white"
                    }`}
                  >
                    Down
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(category)}
                    disabled={
                      deletingCategoryName === category ||
                      products.some(
                        (product) =>
                          product.category.toLowerCase() ===
                          category.toLowerCase(),
                      )
                    }
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium disabled:opacity-50 ${
                      isDark
                        ? "border-white/25 text-white hover:bg-white/10"
                        : "border-[#18201f]/20 text-[#18201f] hover:bg-[#18201f]/5"
                    }`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-semibold">Current Products</h2>
            <button
              type="button"
              onClick={loadProducts}
              className={`rounded-full border px-4 py-2 text-sm font-medium ${
                isDark
                  ? "border-white/25 text-white hover:bg-white/10"
                  : "border-[#18201f]/20 text-[#18201f] hover:bg-white"
              }`}
            >
              Refresh
            </button>
          </div>

          {isLoadingProducts ? (
            <p
              className={`mt-4 text-sm ${isDark ? "text-[#a3b4b0]" : "text-[#4f5d5b]"}`}
            >
              Loading products...
            </p>
          ) : (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product, index) => (
                <article
                  key={product.id ?? product.title}
                  className={`rounded-2xl border p-4 backdrop-blur ${
                    isDark
                      ? "border-white/15 bg-white/5"
                      : "border-[#18201f]/10 bg-white/85"
                  }`}
                >
                  <div className="relative mb-3 aspect-4/3 overflow-hidden rounded-xl">
                    <Image
                      src={resolveProductImageSrc(product.image)}
                      alt={product.title}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>

                  <p
                    className={`text-xs uppercase ${isDark ? "text-[#a3b4b0]" : "text-[#5a6866]"}`}
                  >
                    {product.category}
                  </p>
                  <h3 className="mt-1 text-lg font-medium">{product.title}</h3>
                  <p
                    className={`mt-2 text-sm ${isDark ? "text-[#c1d0cc]" : "text-[#3f4a48]"}`}
                  >
                    {product.description}
                  </p>
                  <p className="mt-3 text-sm font-medium">
                    {product.range || "Price on request"}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <input
                      type="number"
                      min={1}
                      max={products.length}
                      value={
                        reorderingProductPosition[
                          product.id ?? product.title
                        ] ?? String(index + 1)
                      }
                      onChange={(event) =>
                        setReorderingProductPosition((prev) => ({
                          ...prev,
                          [product.id ?? product.title]: event.target.value,
                        }))
                      }
                      className={`w-20 rounded-full border px-3 py-2 text-xs ${
                        isDark
                          ? "border-white/20 bg-[#0f1514] text-white"
                          : "border-[#18201f]/20 bg-white text-[#18201f]"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleSetProductPosition(product.id, index)
                      }
                      disabled={
                        reorderingProductId === product.id || !product.id
                      }
                      className={`rounded-full px-4 py-2 text-sm font-medium ${
                        isDark
                          ? "bg-[#5f7f77] text-white disabled:opacity-50"
                          : "bg-[#18201f] text-white disabled:opacity-50"
                      }`}
                    >
                      Set
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveProduct(product.id, "up")}
                      disabled={
                        index === 0 ||
                        reorderingProductId === product.id ||
                        !product.id
                      }
                      className={`rounded-full px-4 py-2 text-sm font-medium ${
                        isDark
                          ? "bg-[#5f7f77] text-white disabled:opacity-50"
                          : "bg-[#18201f] text-white disabled:opacity-50"
                      }`}
                    >
                      Up
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveProduct(product.id, "down")}
                      disabled={
                        index === products.length - 1 ||
                        reorderingProductId === product.id ||
                        !product.id
                      }
                      className={`rounded-full px-4 py-2 text-sm font-medium ${
                        isDark
                          ? "bg-[#5f7f77] text-white disabled:opacity-50"
                          : "bg-[#18201f] text-white disabled:opacity-50"
                      }`}
                    >
                      Down
                    </button>
                    <button
                      type="button"
                      onClick={() => startEditing(product)}
                      disabled={!product.id}
                      className={`rounded-full px-4 py-2 text-sm font-medium ${
                        isDark
                          ? "bg-[#5f7f77] text-white disabled:opacity-50"
                          : "bg-[#18201f] text-white disabled:opacity-50"
                      }`}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(product.id)}
                      disabled={!product.id}
                      className={`rounded-full border px-4 py-2 text-sm font-medium ${
                        isDark
                          ? "border-white/35 text-white hover:bg-white/10 disabled:opacity-50"
                          : "border-[#18201f]/25 text-[#18201f] hover:bg-[#18201f]/5 disabled:opacity-50"
                      }`}
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
