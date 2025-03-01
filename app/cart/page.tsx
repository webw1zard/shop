"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Home from "../_components/header";
import { createClient } from "@/supabase/client";

interface Product {
  id: string;
  title: string;
  price: number;
  images: string[];
  quantity: number;
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [coupon, setCoupon] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const supabase = createClient();
  const shipping = 16;
  const router = useRouter();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        if (!Array.isArray(cart)) {
          console.error("Invalid cart data:", cart);
          setCartItems([]);
          return;
        }

        const { data: products, error } = await supabase
          .from("product")
          .select("id, title, price, images");

        if (error) {
          console.error("Error fetching products:", error.message);
          return;
        }

        const updatedCart = cart.map((item) => {
          const product = products.find((p) => p.id === item.id);
          return product
            ? {
                ...item,
                title: product.title,
                price: product.price,
                images: Array.isArray(product.images)
                  ? product.images
                  : typeof product.images === "string"
                  ? JSON.parse(product.images || "[]")
                  : [],
              }
            : item;
        });

        setCartItems(updatedCart);
        calculateSubtotal(updatedCart);
      } catch (error) {
        console.error("Error processing cart:", error);
        setCartItems([]);
      }
    };

    fetchCartItems();
  }, []);

  const calculateSubtotal = (items: Product[]) => {
    const totalPrice = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setSubtotal(totalPrice);
  };

  const saveCart = (updatedCart: Product[]) => {
    try {
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch (error) {
      console.error("Storage quota exceeded, could not save cart.", error);
    }
  };

  const applyCoupon = () => {
    if (coupon === "DISCOUNT10") {
      setDiscount(subtotal * 0.1);
    } else {
      setDiscount(0);
      alert("Invalid coupon code");
    }
  };

  const updateQuantity = (id: string, amount: number) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + amount) }
        : item
    );

    setCartItems(updatedCart);
    calculateSubtotal(updatedCart);
    saveCart(updatedCart); 
  };

  const removeFromCart = (id: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    calculateSubtotal(updatedCart);
    saveCart(updatedCart);
  };

  const proceedToCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const totalAmount = subtotal - discount + shipping;
    const user = await supabase.auth.getUser(); 

    if (!user || !user.data?.user) {
      alert("You must be logged in to place an order.");
      return;
    }

    const orderData = {
      user_id: user.data.user.id,
      items: cartItems,
      total: totalAmount,
      discount,
      shipping,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("orders").insert([orderData]);

    if (error) {
      console.error("Error placing order:", error.message);
      alert("Failed to place the order. Please try again.");
    } else {
      alert("✅ Order placed successfully! Thank you for your purchase.");
      localStorage.removeItem("cart"); 
      setCartItems([]); 
    }
  };

  return (
    <>
      <Home />
      <div className="w-[80%] mx-auto my-10">
        <h1 className="text-3xl font-semibold mb-6">Your Cart</h1>
        {cartItems.length > 0 ? (
          <>
            <div className="grid gap-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 border-b pb-4"
                >
                  <img
                    src={item.images.length > 0 ? item.images[0] : "/default-image.jpg"}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h2 className="text-xl">{item.title}</h2>
                    <p className="text-green-600 font-semibold">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="btn btn-success"
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="btn btn-success"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-green-600 font-semibold ml-auto mt-3">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="btn btn-danger btn-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 text-right">
              <input
                type="text"
                placeholder="Enter coupon code..."
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="border p-2 mr-2"
              />
              <button
                onClick={applyCoupon}
                className="bg-green-600 text-white px-4 py-2 rounded-md"
              >
                Apply
              </button>

              <div className="mt-4">
                <p>Subtotal: ${subtotal.toFixed(2)}</p>
                <p>Coupon Discount: ${discount.toFixed(2)}</p>
                <p>Shipping: ${shipping.toFixed(2)}</p>
                <h2 className="text-2xl font-semibold">
                  Total: ${(subtotal - discount + shipping).toFixed(2)}
                </h2>
              </div>

              <button
                onClick={proceedToCheckout}
                className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 mt-4"
              >
                Proceed To Checkout
              </button>
            </div>
          </>
        ) : (
          <p>Your cart is empty. Continue shopping!</p>
        )}
      </div>
    </>
  );
}
