import { createClient } from "@/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [orderCount, setOrderCount] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    const fetchOrderCount = async () => {
      const { data, error } = await supabase.from("orders").select("*");
      if (error) console.error(error);
      else setOrderCount(data.length);
    };

    fetchOrderCount();

    const channel = supabase
      .channel("orders")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => {
          fetchOrderCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <>
      <nav className="navbar">
        <Link href="/" className="logo">
          GREENSHOP
        </Link>
        <ul className="nav-links">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/shop">Shop</Link>
          </li>
          <li>
            <Link href="/cart">
              <span className="cart-icon">🛒 {orderCount}</span>
            </Link>
          </li>
        </ul>
      </nav>
      <main>{children}</main>
    </>
  );
}
