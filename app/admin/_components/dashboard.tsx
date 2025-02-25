"use client";
import { createClient } from "@/supabase/client";
import React, { useState, useEffect } from "react";
import { FiBox, FiLayers, FiClipboard, FiBarChart2 } from "react-icons/fi";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<string>("Overview");
  const [categories, setCategories] = useState<number>(0);
  const [products, setProducts] = useState<number>(0);
  const [orders, setOrders] = useState<number>(0);

  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: cat, error} = await supabase
        .from("category")
        .select("*");
      if (error) console.error(error);
      else setCategories(cat?.length || 0);

      const { data: prod, error: prodError } = await supabase
        .from("product")
        .select("*");
      if (prodError) console.error(prodError);
      else setProducts(prod?.length || 0);

      const { data: ord, error: ordError } = await supabase
        .from("orders")
        .select("*");
      if (ordError) console.error(ordError);
      else setOrders(ord?.length || 0);
    };

    fetchData();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-4">
        Hi, Admin <span className="wave">👋</span>
      </h2>
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("Overview")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "Overview"
              ? "bg-gray-200 text-black"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("Analytics")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "Analytics"
              ? "bg-gray-200 text-black"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Analytics
        </button>
      </div>

      {activeTab === "Overview" && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card
              title="Total Categories"
              value={`${categories}x`}
              change="+20.1% from last month"
              icon={<FiBox />}
            />
            <Card
              title="Products"
              value={`${products}x`}
              change="+18.1% from last month"
              icon={<FiLayers />}
            />
            <Card
              title="Orders"
              value={`${orders}x`}
              change="+19% from last month"
              icon={<FiClipboard />}
            />
            <Card
              title="Sales"
              value="8x"
              change="+20% since last hour"
              icon={<FiBarChart2 />}
            />
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">Recent Sales</h3>
            <p>You made 15 sales this month.</p>
          </div>
        </div>
      )}

      {activeTab === "Analytics" && (
        <div>
          <h3 className="text-xl font-bold mb-4">Analytics</h3>
          <p>Coming soon...</p>
        </div>
      )}
    </div>
  );
};

const Card = ({
  title,
  value,
  change,
  icon,
}: {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4">
      <div className="text-3xl text-blue-500">{icon}</div>
      <div>
        <h4 className="text-lg font-bold">{title}</h4>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-gray-500">{change}</p>
      </div>
    </div>
  );
};

export default Dashboard;
