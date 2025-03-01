"use client";
import Home from "@/app/_components/header";
import { createClient } from "@/supabase/client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Category {
  id: number;
  title: string;
}

interface Product {
  id: string;
  created_at: string;
  title: string;
  categoryId: number;
  desc: string;
  price: string;
  images: string[];
  active: boolean;
}

const supabase = createClient();

export default function ProductDetail({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!params?.id) return;

    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("product")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      setProduct(data);
      setSelectedImage(data.images[0]);
      fetchRelatedProducts(data.categoryId);
    };

    const fetchCategories = async () => {
      const { data, error } = await supabase.from("category").select("*");

      if (error) {
        console.error(error);
        return;
      }

      setCategories(data);
    };

    const fetchRelatedProducts = async (categoryId: number) => {
      const { data, error } = await supabase
        .from("product")
        .select("*")
        .eq("categoryId", categoryId)
        .neq("id", params.id)
        .limit(4);

      if (error) {
        console.error(error);
        return;
      }

      setRelatedProducts(data);
    };

    fetchProduct();
    fetchCategories();
  }, [params.id]);

  const addToCart = (product: Product) => {
    try {
      const cartString = localStorage.getItem("cart");
      const existingCart: (Product & { quantity: number })[] = cartString
        ? JSON.parse(cartString)
        : [];

      const existingProductIndex = existingCart.findIndex(
        (item) => item.id === product.id
      );

      if (existingProductIndex > -1) {
        existingCart[existingProductIndex].quantity += 1;
      } else {
        // @ts-expect-error
        existingCart.push({
          id: product.id,
          title: product.title,
          price: product.price,
          quantity: 1,
        }); // ✅ Faqat kerakli ma'lumotlarni saqlaymiz
      }

      localStorage.setItem("cart", JSON.stringify(existingCart));
      alert("Added to cart!");
    } catch (error) {
      console.error("Error saving to localStorage:", error);
      alert("Cart is full. Please clear some items.");
    }
  };

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full">
      <Home />
      <div className="w-[80%] mx-auto">
        <div className="flex gap-10 my-10">
          <div className="w-1/2">
            <div className="flex flex-col items-center">
              <img
                src={selectedImage || product.images[0]}
                alt={product.title}
                className="w-full h-[400px] object-cover rounded-lg transition-all duration-300"
              />
              <div className="flex gap-2 mt-4">
                {product.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 object-cover rounded-md cursor-pointer transition-all duration-200 ${
                      selectedImage === img
                        ? "border-2 border-green-600 opacity-100"
                        : "opacity-50 hover:opacity-75"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="w-1/2">
            <h1 className="text-3xl font-semibold">{product.title}</h1>
            <p className="text-green-600 text-2xl font-bold mt-2">
              ${product.price}
            </p>
            <p className="text-gray-600 mt-4">{product.desc}</p>

            <div className="mt-6 flex items-center gap-4">
              <button className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700">
                BUY NOW
              </button>
              <button
                onClick={() => addToCart(product)}
                className="border border-green-600 text-green-600 px-6 py-3 rounded-md hover:bg-green-100"
              >
                ADD TO CART
              </button>
            </div>

            <p className="text-gray-500 text-sm mt-4">
              {product.created_at.slice(0, 10)}
            </p>
            <p className="text-gray-500 text-sm">
              Category:{" "}
              {categories.find((cat) => cat.id === product.categoryId)?.title ||
                "Unknown"}
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mt-10">Related Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
          {relatedProducts.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg p-4 cursor-pointer hover:shadow-md"
              onClick={() => router.push(`/product/${item.id}`)}
            >
              <img
                src={item.images[0]}
                alt={item.title}
                className="w-full h-40 object-cover rounded-md"
              />
              <h3 className="text-lg font-semibold mt-2">{item.title}</h3>
              <p className="text-green-600 font-bold">${item.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
