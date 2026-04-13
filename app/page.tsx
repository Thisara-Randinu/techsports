"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useThemeMode } from "./ThemeRegistry";
import { type Product } from "@/lib/products";

const aboutPoints = [
  {
    title: "Unmatched Quality",
    text: "Every item is selected for its superior craftsmanship and performance, ensuring you get the best.",
  },
  {
    title: "Everyday Durability",
    text: "Products chosen from best brands to withstand the demands of regular usage.",
  },
  {
    title: "Top-tier After-sales Service",
    text: "Warranties of 2+ years for chess clocks, ensuring your investment is protected.",
  },
];

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

export default function Home() {
  const { mode } = useThemeMode();
  const isDark = mode === "dark";
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const productSectionRef = useRef<HTMLElement>(null);
  const whatsappLink = "https://wa.me/94771091444?text=Hi";

  useEffect(() => {
    async function loadData() {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          fetch("/api/products", { cache: "no-store" }),
          fetch("/api/categories", { cache: "no-store" }),
        ]);

        let loadedProducts: Product[] = [];
        if (productsResponse.ok) {
          const productsData = (await productsResponse.json()) as {
            products?: Product[];
          };
          loadedProducts = productsData.products ?? [];
          setProducts(loadedProducts);
        }

        if (categoriesResponse.ok) {
          const categoriesData = (await categoriesResponse.json()) as {
            categories?: string[];
          };
          setCategories(categoriesData.categories ?? []);
        } else if (loadedProducts.length > 0) {
          const derivedCategories = Array.from(
            new Set(loadedProducts.map((product) => product.category)),
          );
          setCategories(derivedCategories);
        }
      } catch {
        // Keep defaults if requests fail.
      }
    }

    loadData();
  }, []);

  const availableCategories = useMemo(
    () =>
      categories.filter((category) =>
        products.some((product) => product.category === category),
      ),
    [categories, products],
  );

  const categoryOptions = useMemo(
    () => ["All", ...availableCategories],
    [availableCategories],
  );

  const activeCategory = categoryOptions.includes(selectedCategory)
    ? selectedCategory
    : "All";

  const visibleProducts = useMemo(() => {
    if (activeCategory === "All") return products;
    return products.filter((product) => product.category === activeCategory);
  }, [activeCategory, products]);

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
              ? "radial-gradient(circle at 20% 20%, rgba(63, 87, 80, 0.2), transparent 45%), radial-gradient(circle at 80% 10%, rgba(59, 78, 113, 0.22), transparent 42%), radial-gradient(circle at 50% 85%, rgba(43, 56, 53, 0.18), transparent 40%)"
              : "radial-gradient(circle at 20% 20%, rgba(216, 238, 203, 0.45), transparent 45%), radial-gradient(circle at 80% 10%, rgba(201, 217, 247, 0.45), transparent 42%), radial-gradient(circle at 50% 85%, rgba(232, 240, 228, 0.5), transparent 40%)",
          }}
        />
        <motion.div
          className={`absolute -left-20 top-8 h-72 w-72 rounded-full blur-3xl ${
            isDark ? "bg-[#2d4734]/60" : "bg-[#d8eecb]"
          }`}
          animate={{ x: [0, 24, 0], y: [0, -18, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className={`absolute -right-24 top-40 h-80 w-80 rounded-full blur-3xl ${
            isDark ? "bg-[#334461]/65" : "bg-[#c9d9f7]"
          }`}
          animate={{ x: [0, -26, 0], y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className={`absolute left-[18%] top-[46%] h-56 w-56 rounded-full blur-3xl ${
            isDark ? "bg-[#32524a]/35" : "bg-[#d4e4cc]/55"
          }`}
          animate={{ x: [0, 16, 0], y: [0, 14, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className={`absolute right-[20%] top-[62%] h-64 w-64 rounded-full blur-3xl ${
            isDark ? "bg-[#384f72]/32" : "bg-[#d7e2fa]/50"
          }`}
          animate={{ x: [0, -14, 0], y: [0, 12, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className={`absolute -bottom-16 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl ${
            isDark ? "bg-[#3b5244]/28" : "bg-[#e8f1dd]/50"
          }`}
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-6 sm:pb-20 sm:pt-12 lg:px-10 lg:pt-16">
        <div className="mb-8 flex justify-end">
          {/* <button
            type="button"
            onClick={toggleTheme}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              isDark
                ? "border border-white/20 bg-white/10 text-white hover:bg-white/15"
                : "border border-[#18201f]/20 bg-white/85 text-[#18201f] hover:bg-white"
            }`}
          >
            {isDark ? "Switch to Light" : "Switch to Dark"}
          </button> */}
        </div>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="grid items-end gap-8 md:grid-cols-[1.2fr_0.8fr]"
        >
          <div>
            <p
              className={`text-xs uppercase tracking-[0.24em] ${
                isDark ? "text-[#a3b4b0]" : "text-[#4f5d5b]"
              }`}
            >
              TechSport
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">
              You make the moves. We handle the rest.
            </h1>
            <p
              className={`mt-5 max-w-xl text-base leading-7 sm:text-lg ${
                isDark ? "text-[#c1d0cc]" : "text-[#3f4a48]"
              }`}
            >
              Discover a curated selection of Chess Clocks and Chess Boards
              designed to elevate your game and enhance every match.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  productSectionRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  })
                }
                className={`rounded-full px-6 py-3 text-sm font-medium text-white transition-transform duration-200 hover:scale-[1.03] ${
                  isDark ? "bg-[#5f7f77]" : "bg-[#18201f]"
                }`}
              >
                Explore Products
              </button>
              {/* <button
                type="button"
                onClick={() => setSelectedCategory("All")}
                className={`rounded-full px-6 py-3 text-sm font-medium backdrop-blur transition-colors ${
                  isDark
                    ? "border border-white/20 bg-white/10 text-white hover:bg-white/15"
                    : "border border-[#18201f]/25 bg-white/80 text-[#18201f] hover:bg-white"
                }`}
              >
                Reset View
              </button> */}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className={`rounded-3xl border p-6 backdrop-blur ${
              isDark
                ? "border-white/15 bg-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
                : "border-white/70 bg-white/80 shadow-[0_20px_50px_rgba(24,32,31,0.09)]"
            }`}
          >
            <p
              className={`text-sm ${isDark ? "text-[#a3b4b0]" : "text-[#4f5d5b]"}`}
            >
              Currently featuring
            </p>
            <p className="mt-2 text-4xl font-semibold">
              {products.length}+ products
            </p>
            <div className="mt-6 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <div
                className={`rounded-2xl p-3 ${isDark ? "bg-[#23312d]" : "bg-[#eef4e9]"}`}
              >
                <p className="text-2xl font-semibold">
                  {availableCategories.length}
                </p>
                <p className={isDark ? "text-[#a3b4b0]" : "text-[#4f5d5b]"}>
                  Core categories
                </p>
              </div>
              <div
                className={`rounded-2xl p-3 ${isDark ? "bg-[#252f3e]" : "bg-[#ebf0fb]"}`}
              >
                <p className="text-2xl font-semibold">24h</p>
                <p className={isDark ? "text-[#a3b4b0]" : "text-[#4f5d5b]"}>
                  Dispatch target
                </p>
              </div>
            </div>
          </motion.div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6 }}
          className="mt-24"
        >
          <h2 className="text-2xl font-semibold sm:text-3xl">
            About TechSport
          </h2>
          <p
            className={`mt-4 max-w-2xl ${isDark ? "text-[#c1d0cc]" : "text-[#3f4a48]"}`}
          >
            We sell high quality chess boards and chess clocks from the best
            brands in the market.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {aboutPoints.map((point, index) => (
              <motion.article
                key={point.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.45, delay: index * 0.12 }}
                className={`rounded-2xl border p-5 ${
                  isDark
                    ? "border-white/15 bg-white/5"
                    : "border-[#18201f]/10 bg-white/75"
                }`}
              >
                <h3 className="text-lg font-medium">{point.title}</h3>
                <p
                  className={`mt-2 text-sm leading-6 ${isDark ? "text-[#a3b4b0]" : "text-[#4f5d5b]"}`}
                >
                  {point.text}
                </p>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <section ref={productSectionRef} className="mt-24 scroll-mt-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold sm:text-3xl">Products</h2>
              <p
                className={`mt-3 ${isDark ? "text-[#c1d0cc]" : "text-[#3f4a48]"}`}
              >
                Filter the collection to match your current focus.
              </p>
            </div>
            <div className="flex max-w-full flex-nowrap gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
              {categoryOptions.map((category) => {
                const active = activeCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-full px-4 py-2 text-sm transition-all ${
                      active
                        ? isDark
                          ? "bg-[#5f7f77] text-white"
                          : "bg-[#18201f] text-white"
                        : isDark
                          ? "border border-white/20 bg-white/5 text-white hover:border-white/35"
                          : "border border-[#18201f]/20 bg-white/80 text-[#18201f] hover:border-[#18201f]/35"
                    } whitespace-nowrap`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleProducts.map((item, index) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                whileHover={{ y: -5 }}
                className={`group rounded-2xl border p-5 backdrop-blur ${
                  isDark
                    ? "border-white/15 bg-white/5 shadow-[0_10px_24px_rgba(0,0,0,0.25)]"
                    : "border-[#18201f]/10 bg-white/85 shadow-[0_10px_24px_rgba(24,32,31,0.05)]"
                }`}
              >
                <div className="relative mb-4 aspect-4/3 overflow-hidden rounded-xl">
                  <Image
                    src={resolveProductImageSrc(item.image)}
                    alt={item.title}
                    fill
                    priority={index === 0}
                    quality={70}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div
                    className={`pointer-events-none absolute inset-0 ${
                      isDark
                        ? "bg-linear-to-t from-[#121b19]/45 via-transparent to-transparent"
                        : "bg-linear-to-t from-[#18201f]/20 via-transparent to-transparent"
                    }`}
                  />
                </div>
                <p
                  className={`text-xs uppercase tracking-[0.15em] ${
                    isDark ? "text-[#a3b4b0]" : "text-[#5a6866]"
                  }`}
                >
                  {item.category}
                </p>
                <h3 className="mt-3 text-lg font-medium">{item.title}</h3>
                <p
                  className={`mt-2 text-sm leading-6 ${isDark ? "text-[#c1d0cc]" : "text-[#4f5d5b]"}`}
                >
                  {item.description}
                </p>
                <div className="mt-5 flex items-center justify-between">
                  <span
                    className={`text-sm font-medium ${isDark ? "text-[#edf3ef]" : "text-[#18201f]"}`}
                  >
                    {item.range || "Price on request"}
                  </span>
                  <span
                    className={`text-sm transition-transform duration-200 group-hover:translate-x-1 ${
                      isDark ? "text-[#a3b4b0]" : "text-[#4f5d5b]"
                    }`}
                  >
                    View
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55 }}
          className={`mt-24 rounded-3xl border p-8 sm:p-10 ${
            isDark
              ? "border-white/15 bg-[#121b19] text-[#edf3ef]"
              : "border-[#18201f]/15 bg-[#18201f] text-white"
          }`}
        >
          <p
            className={`text-xs uppercase tracking-[0.2em] ${
              isDark ? "text-white/70" : "text-white/70"
            }`}
          >
            Ready to Train Better?
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
            Join with TechSport and experience the difference in your game.
          </h2>
          <p
            className={`mt-4 max-w-2xl ${isDark ? "text-white/80" : "text-white/80"}`}
          >
            High quality, durable chess accessories that support your growth and
            passion for the game.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() =>
                productSectionRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                })
              }
              className={`rounded-full px-6 py-3 text-sm font-medium transition-transform duration-200 hover:scale-[1.03] ${
                isDark ? "bg-[#5f7f77] text-white" : "bg-white text-[#18201f]"
              }`}
            >
              Shop Collection
            </button>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className={`rounded-full border px-6 py-3 text-sm font-medium transition-colors ${
                isDark
                  ? "border-white/35 text-white hover:bg-white/10"
                  : "border-white/40 text-white hover:bg-white/10"
              }`}
            >
              Contact Team
            </a>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
