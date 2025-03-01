"use client";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/supabase/client";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
const supabase = createClient();

interface User {
  id: string;
  role: string;
}

export default function Home() {
  const [orderCount, setOrderCount] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [len, setLen] = useState(0);

  const fetchOrderCount = useCallback(async () => {
    const { data, error } = await supabase.from("orders").select("*");
    if (error) console.error("Error fetching orders:", error);
    else setOrderCount(data.length);
  }, []);
  useEffect(() => {
    fetchOrderCount();
  setLen(localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart") as string).length : 0);

    const channel = supabase
      .channel("orders")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        () => fetchOrderCount()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchOrderCount]);

  // const checkUser = useCallback(async () => {
  //   const { data: sessionData} =
  //     await supabase.auth.getSession();
  //   const session = sessionData?.session;
  //   console.log(session);
    
  //   if (session?.user) {
  //     const { data: userData, error: userError } = await supabase
  //       .from("users")
  //       .select("role")
  //       .eq("id", session.user.id)
  //       .single();

  //     if (userError) {
  //       console.error(userError);
  //     } else {
  //       setUser({ id: session.user.id, role: userData.role });
  //     }
  //   }
  // }, []);

  // useEffect(() => {
  //   checkUser();
  // }, [checkUser]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error(error);
    else setUser(null);
  };

  return (
    <>
      <nav className="flex justify-between items-center p-4 bg-white shadow-md sticky top-0 z-50">
        <Link
          href="/"
          className="text-3xl font-extrabold text-green-600 hover:text-green-700 transition"
        >
          GREENSHOP
        </Link>
        <ul className="flex space-x-6 text-lg font-semibold">
          <li>
            <Link
              href="/"
              className="px-4 py-2 rounded-md text-white bg-green-600 hover:bg-green-700 transition duration-300"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/shop"
              className="px-4 py-2 rounded-md text-white bg-green-600 hover:bg-green-700 transition duration-300"
            >
              Shop
            </Link>
          </li>
          {user?.role === "admin" && (
            <li>
              <Link
                href="/admin"
                className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition duration-300"
              >
                Admin
              </Link>
            </li>
          )}

          {user ? (
            <li>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 transition duration-300"
              >
                Logout
              </button>
            </li>
          ) : (
            <li>
              <Link
                href="/login"
                className="px-4 py-2 rounded-md text-white bg-green-600 hover:bg-green-700 transition duration-300"
              >
                Login
              </Link>
            </li>
          )}

          <li className="relative">
            <Link
              href="/cart"
              className="rounded-md text-white transition duration-300 flex items-center"
            >
              🛒
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs rounded-full px-2">
                {len}
              </span>
            </Link>
          </li>
          
        </ul>
      </nav>

      {/* <section className="px-20 py-10 bg-gradient-to-b from-green-50 to-green-100">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          loop={true}
          className="w-full h-[600px] rounded-2xl overflow-hidden shadow-lg"
        >
          <SwiperSlide>
            <div className="relative w-full h-full">
              <Image
                src="https://images.unsplash.com/photo-1605825473282-8de5b8d35537?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
                alt="Plant 1"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-center items-center text-center text-white p-4">
                <h1 className="text-6xl font-extrabold mb-4 animate-fadeInUp">
                  LET'S MAKE A{" "}
                  <span className="text-green-400">BETTER PLANET</span>
                </h1>
                <p className="text-xl mb-6 animate-fadeInUp delay-200">
                  Discover our range of trendy and affordable plants.
                </p>
                <button className="bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition duration-300 animate-fadeInUp delay-400">
                  SHOP NOW
                </button>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </section> */}
    </>
  );
}
