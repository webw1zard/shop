"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@/supabase/client";
import Home from "../_components/header";

export default function Cabinet() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedEmail, setUpdatedEmail] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        alert("You must be logged in");
        return;
      }

      const { data: userData, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", session.session.user.id)
        .single();

      if (error) {
        console.error(error.message);
        return;
      }

      setUser(userData);
      setUpdatedName(userData.name || "");
      setUpdatedEmail(userData.email || "");

      const { data: userOrders, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .eq("userId", userData.id);

      if (ordersError) {
        console.error(ordersError.message);
        return;
      }

      setOrders(userOrders);
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleUpdate = async () => {
    const { error } = await supabase
      .from("users")
      .update({ name: updatedName, email: updatedEmail })
      .eq("id", user.id);

    if (error) {
      console.error(error.message);
      alert("Failed");
    } else {
      alert("successfully!");
      setUser({ ...user, name: updatedName, email: updatedEmail });
      setEditing(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>You are not logged in.</p>;
  }

  return (
    <>
      <Home />
      <div className="w-[80%] mx-auto my-10">
        <h1 className="text-3xl font-semibold mb-6">User Cabinet</h1>

        {/* User Info */}
        <div className="bg-gray-100 p-6 rounded-lg mb-6">
          {editing ? (
            <>
              <input
                type="text"
                value={updatedName}
                onChange={(e) => setUpdatedName(e.target.value)}
                className="border p-2 mb-2 w-full"
                placeholder="Enter name"
              />
              <input
                type="email"
                value={updatedEmail}
                onChange={(e) => setUpdatedEmail(e.target.value)}
                className="border p-2 mb-2 w-full"
                placeholder="Enter email"
              />
              <button onClick={handleUpdate} className="bg-green-600 text-white px-4 py-2 rounded-md">
                Save Changes
              </button>
            </>
          ) : (
            <>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <button onClick={() => setEditing(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md">
                Edit Profile
              </button>
            </>
          )}
        </div>

        {/* Orders */}
        <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>
        {orders.length > 0 ? (
          <div className="grid gap-6">
            {orders.map((order) => (
              <div key={order.id} className="border p-4 rounded-lg">
                <p><strong>Order ID:</strong> {order.id}</p>
                <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
                <p><strong>Created At:</strong> {new Date(order.created_at).toLocaleString()}</p>
                <p><strong>Items:</strong></p>
                <ul>
                  {order.items.map((item: any) => (
                    <li key={item.id}>{item.title} (x{item.quantity})</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p>You have no orders yet.</p>
        )}
      </div>
    </>
  );
}
