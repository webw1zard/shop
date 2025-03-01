"use client";
import { createClient } from "@/supabase/client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { CiHeart } from "react-icons/ci";

const supabase = createClient();

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

export default function LikedPage() {
  const router = useRouter();
  const [likedProducts, setLikedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLikedProducts();
  }, []);

  async function fetchLikedProducts() {
    const savedLikes = JSON.parse(localStorage.getItem("likedProducts") || "[]");

    if (savedLikes.length === 0) {
      setLikedProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from("product")
      .select("*")
      .in("id", savedLikes)
      .eq("active", true);

    if (error) {
      console.error(error);
    } else {
      const formattedProducts = data.map((product) => ({
        ...product,
        images: typeof product.images === "string" ? JSON.parse(product.images) : product.images || [],
      }));
      setLikedProducts(formattedProducts);
    }
    setLoading(false);
  }

  function removeLike(productId: string) {
    const updatedLikes = likedProducts.filter((product) => product.id !== productId);
    setLikedProducts(updatedLikes);

    const storedLikes = JSON.parse(localStorage.getItem("likedProducts") || "[]");
    const newLikes = storedLikes.filter((id: string) => id !== productId);
    localStorage.setItem("likedProducts", JSON.stringify(newLikes));
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Liked Products</h1>
      {loading ? (
        <p>Loading...</p>
      ) : likedProducts.length === 0 ? (
        <p className="text-gray-500">No liked products found.</p>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {likedProducts.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition text-center">
              <CiHeart
                className="text-2xl cursor-pointer text-red-500"
                onClick={() => removeLike(product.id)}
              />
              {product.images.length > 0 && (
                <img src={product.images[0]} alt={product.title} className="w-full h-40 object-cover rounded-md mb-3" />
              )}
              <h3 className="text-lg font-semibold">{product.title}</h3>
              <p className="text-sm text-gray-500">{product.desc}</p>
              <p className="text-green-600 font-bold">${product.price}</p>
              <p className="text-gray-500 font-thin">{product.created_at.slice(0, 10)}</p>
              <button
                className="btn btn-success rounded-sm mt-2"
                onClick={() => router.push(`/product/${product.id}`)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
