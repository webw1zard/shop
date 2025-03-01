"use client";
import { createClient } from "@/supabase/client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { CiHeart } from "react-icons/ci";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const supabase = createClient();

interface Category {
  id: number;
  title: string;
}

interface Product {
  id: string;
  title: string;
  created_at: string;
  categoryId: number;
  desc: string;
  price: string;
  images: string[];
  active: boolean;
}

export default function ProductsPage() {
  const router = useRouter();
  const [category, setCategories] = useState<Category[]>([]);
  const [product, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [categoryCounts, setCategoryCounts] = useState<Record<number, number>>({});
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [likedProducts, setLikedProducts] = useState<string[]>([]);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
    const savedLikes = JSON.parse(localStorage.getItem("likedProducts") || "[]");
    setLikedProducts(savedLikes);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  async function fetchCategories() {
    setLoadingCategories(true);
    const { data, error } = await supabase.from("category").select("*");
    if (error) console.error(error);
    else setCategories(data);
    setLoadingCategories(false);
  }

  async function fetchProducts() {
    setLoadingProducts(true);
    let query = supabase.from("product").select("*").eq("active", true);
    if (selectedCategory !== null) {
      query = query.eq("categoryId", selectedCategory);
    }
    const { data, error } = await query;
    if (error) {
      console.error(error);
    } else {
      const filteredProducts = data.map((product) => ({
        ...product,
        images:
          typeof product.images === "string"
            ? JSON.parse(product.images)
            : product.images || [],
      }));
      setProducts(filteredProducts);
      countProducts(filteredProducts);
    }
    setLoadingProducts(false);
  }

  async function countProducts(allProducts: Product[]) {
    const counts: Record<number, number> = {};
    allProducts.forEach((product) => {
      if (!counts[product.categoryId]) counts[product.categoryId] = 0;
      counts[product.categoryId]++;
    });
    setCategoryCounts(counts);
  }

  function toggleLike(productId: string) {
    let updatedLikes;
    if (likedProducts.includes(productId)) {
      updatedLikes = likedProducts.filter((id) => id !== productId);
    } else {
      updatedLikes = [...likedProducts, productId];
    }
    setLikedProducts(updatedLikes);
    localStorage.setItem("likedProducts", JSON.stringify(updatedLikes));
  }

  return (
    <div className="flex justify-center items-start p-6 gap-6">
      <div className="h-[500px] w-[300px] shadow-md border bg-white rounded-lg p-4">
        <h1 className="text-2xl font-bold text-gray-800">Category</h1>
        <ul className="mt-4 space-y-3">
          {loadingCategories ? (
            Array.from({ length: 4 }).map((_, index) => (
              <li key={index}>
                <Skeleton width={150} height={20} />
              </li>
            ))
          ) : (
            <>
              <li
                className={`cursor-pointer text-lg font-medium ${selectedCategory === null ? "text-green-600" : "text-gray-700"} hover:text-green-500`}
                onClick={() => setSelectedCategory(null)}
              >
                All Products <span className="text-gray-500">({product.length})</span>
              </li>
              {category.map((category) => (
                <li
                  key={category.id}
                  className={`flex justify-between items-center cursor-pointer text-lg font-medium ${selectedCategory === category.id ? "text-green-600" : "text-gray-700"} hover:text-green-500`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <span>{category.title}</span>
                  <span className="text-gray-500">({categoryCounts[category.id] || 0})</span>
                </li>
              ))}
            </>
          )}
        </ul>
      </div>

      <div className="min-h-[500px] w-full rounded-lg border shadow-md bg-white p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {selectedCategory ? category.find((c) => c.id === selectedCategory)?.title : "All Products"}
        </h2>
        <div className="grid grid-cols-3 gap-6">
          {loadingProducts
            ? Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="border rounded-lg p-4 shadow-sm">
                  <Skeleton height={160} className="rounded-md mb-3" />
                  <Skeleton height={20} width="80%" className="mb-2" />
                  <Skeleton height={15} width="60%" className="mb-1" />
                  <Skeleton height={15} width="40%" className="mb-1" />
                  <Skeleton height={15} width="50%" />
                </div>
              ))
            : product.length > 0 ? (
                product.map((product) => (
                  <div key={product.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition text-center relative">
                    <button className={`text-2xl cursor-pointer ${likedProducts.includes(product.id) ? "text-red-500" : "text-gray-400"} `}>
                    <CiHeart
                      className={`text-2xl cursor-pointer ${likedProducts.includes(product.id) ? "text-red-500" : "text-gray-400"}`}
                      onClick={() => toggleLike(product.id)}
                    />
                    </button>
                    {product.images.length > 0 && (
                      <img src={product.images[0]} alt={product.title} className="w-full h-40 object-cover rounded-md mb-3" />
                    )}
                    <h3 className="text-lg font-semibold">{product.title}</h3>
                    <p className="text-sm text-gray-500">{product.desc}</p>
                    <p className="text-green-600 font-bold">${product.price}</p>
                    <p className="text-gray-500 font-thin">{product.created_at.slice(0, 10)}</p>
                    <button className="btn btn-success rounded-sm mt-2" onClick={() => router.push(`/product/${product.id}`)}>View Details</button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No products found.</p>
              )}
        </div>
      </div>
    </div>
  );
}
