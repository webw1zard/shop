"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/supabase/client";

export default function Shop1() {
  const [categories, setCategories] = useState<any>([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState([39, 1230]);
  const [size, setSize] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const supabase = createClient()

  const fetchCategories = async () => {
    const { data, error } = await supabase.from("category").select("*");
    if (error) console.error(error);
    else setCategories(data);
  };

  const fetchProducts = async () => {
    let query = supabase.from("product").select("*");
    

    if (selectedCategory) {
      query = query.eq("category_id", selectedCategory);
    }
    if (size) {
      query = query.eq("size", size);
    }
    query = query
      .gte("price", priceRange[0])
      .lte("price", priceRange[1])
      .range((page - 1) * 9, page * 9 - 1);

    const { data, error, count } = await query;
    console.log(data);
    
    if (error) console.error(error);
    else {
      setProducts(data as any);
      setTotalPages(Math.ceil(count! / 9));
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [selectedCategory, priceRange, size, page]);

  return (
    <div className="flex">
      <aside className="w-1/4 p-4">
        <h2 className="text-xl font-bold mb-4">Categories</h2>
        <ul className="space-y-2">
          {categories.map((cat: any) => (
            <li key={cat.id}>
              <button
                className={`text-left w-full ${
                  selectedCategory === cat.id ? "text-green-600" : ""
                }`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.name}
              </button>
            </li>
          ))}
          <li>
            <button
              className="text-left w-full"
              onClick={() => setSelectedCategory(null)}
            >
              All Plants
            </button>
          </li>
        </ul>

        <h2 className="text-xl font-bold mt-6 mb-2">Price Range</h2>
        <input
          type="range"
          min="39"
          max="1230"
          value={priceRange[0]}
          onChange={(e) =>
            setPriceRange([Number(e.target.value), priceRange[1]])
          }
          className="w-full"
        />
        <input
          type="range"
          min="39"
          max="1230"
          value={priceRange[1]}
          onChange={(e) =>
            setPriceRange([priceRange[0], Number(e.target.value)])
          }
          className="w-full"
        />
        <p className="mt-2">
          Price: ${priceRange[0]} - ${priceRange[1]}
        </p>

        <h2 className="text-xl font-bold mt-6 mb-2">Size</h2>
        <ul className="space-y-2">
          <li>
            <button onClick={() => setSize("Small")}>Small</button>
          </li>
          <li>
            <button onClick={() => setSize("Medium")}>Medium</button>
          </li>
          <li>
            <button onClick={() => setSize("Large")}>Large</button>
          </li>
          <li>
            <button onClick={() => setSize("")}>All Sizes</button>
          </li>
        </ul>
      </aside>

      <main className="w-3/4 p-4 grid grid-cols-3 gap-6">
        {products.map((product: any) => (
          <div
            key={product.id}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition"
          >
            <Image
              src={product.image}
              alt={product.title}
              width={300}
              height={300}
              className="rounded-lg object-cover"
            />
            <h3 className="text-lg font-semibold mt-4">{product.title}</h3>
            <p className="text-green-600 font-bold">${product.price}</p>
            {product.discount && (
              <span className="bg-red-600 text-white text-sm rounded-full px-2 py-1">
                {product.discount}% OFF
              </span>
            )}
            <Link href={`/product/${product.id}`}>
              <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition">
                View Details
              </button>
            </Link>
          </div>
        ))}
      </main>
    </div>
  );
}
