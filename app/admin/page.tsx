"use client";
import Image from "next/image";
import React, { useState } from "react";
import im from "../favicon.ico";
import { FiGlobe, FiHome } from "react-icons/fi";
import { TbCategory } from "react-icons/tb";
import { FaJediOrder } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import Dashboard from "./_components/dashboard";
import Category from "./_components/category";
import { GrUser } from "react-icons/gr";
import { MdProductionQuantityLimits } from "react-icons/md";
import ProductManagement from "./_components/products";
import OrdersPage from "./_components/orders";
import Users from "./_components/users";
function Admin() {
  const [selectedMenu, setSelectedMenu] = useState<string>("Dashboard");
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="sidebar min-h-screen bg-white shadow-lg rounded-r-3xl p-4 flex flex-col items-center w-64 space-y-4">
        <div className="logo mb-8 flex flex-col items-center">
          <Image
            src={im}
            alt="logo"
            width={80}
            height={80}
            className="rounded-3xl"
          />
          <h1 className="text-black text-2xl font-bold mt-2">f0rest</h1>
        </div>

        <MenuItem
          icon={<FiGlobe />}
          title="Dashboard"
          setSelectedMenu={setSelectedMenu}
          selectedMenu={selectedMenu}
        />
        <MenuItem
          icon={<TbCategory />}
          title="Categories"
          setSelectedMenu={setSelectedMenu}
          selectedMenu={selectedMenu}
        />
        <MenuItem
          icon={<FaJediOrder />}
          title="Orders"
          setSelectedMenu={setSelectedMenu}
          selectedMenu={selectedMenu}
        />
        <MenuItem
          icon={<MdProductionQuantityLimits />}
          title="Products"
          setSelectedMenu={setSelectedMenu}
          selectedMenu={selectedMenu}
        />
          <MenuItem
            icon={<GrUser />}
            title="Users"
            setSelectedMenu={setSelectedMenu}
            selectedMenu={selectedMenu}
          />
        <MenuItem
          icon={<IoSettingsOutline />}
          title="Settings"
          setSelectedMenu={setSelectedMenu}
          selectedMenu={selectedMenu}
        />
        <MenuItem
          icon={<FiHome />}
          title="Home"
          setSelectedMenu={setSelectedMenu}
          selectedMenu={selectedMenu}
          onClick={() => router.push("/")}
        />
      </div>

      <div className="content flex-1 p-8">
        {selectedMenu === "Dashboard" && (
          <div>
            <h2 className="text-3xl font-bold mb-4">Dashboard</h2>
            <Dashboard />
          </div>
        )}
        {selectedMenu === "Categories" && (
          <div>
            <h2 className="text-3xl font-bold mb-4">Categories</h2>
            <Category />
          </div>
        )}
        {selectedMenu === "Orders" && (
          <div>
            <h2 className="text-3xl font-bold mb-4">Orders</h2>
            <OrdersPage/>
          </div>
        )}
        {selectedMenu === "Settings" && (
          <div>
            <h2 className="text-3xl font-bold mb-4">Settings</h2>
            <p>Coming Soon...</p>
          </div>
        )}
        {selectedMenu === "Users" && (
          <div>
            <h2 className="text-3xl font-bold mb-4">Users</h2>
            <Users/>
          </div>
        )}
        {selectedMenu === "Products" && (
          <div>
            <h2 className="text-3xl font-bold mb-4">Product</h2>
            <ProductManagement />
          </div>
        )}
      </div>
    </div>
  );
}

const MenuItem = ({
  icon,
  title,
  setSelectedMenu,
  selectedMenu,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  setSelectedMenu: (title: string) => void;
  selectedMenu: string;
  onClick?: () => void;
}) => {
  const isActive = selectedMenu === title;
  return (
    <div
      className={`flex items-center p-4 min-w-[200px] rounded-2xl shadow-md text-lg cursor-pointer transition-transform transform hover:scale-105 ${
        isActive
          ? "bg-gradient-to-r from-purple-400 to-blue-500 text-white"
          : "bg-white text-gray-700"
      }`}
      onClick={() => {
        setSelectedMenu(title);
        if (onClick) onClick();
      }}
    >
      <div className="mr-3 text-2xl">{icon}</div>
      <span>{title}</span>
    </div>
  );
};

export default Admin;
