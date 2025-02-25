"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/supabase/client";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleRegister = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Ro'yxatdan o'tdingiz! Emailingizni tasdiqlang.");
      router.push("/");
    }
    setLoading(false);

    const { data } = await supabase
      .from("users")
      .insert([{ some_column: "someValue", other_column: "otherValue" }])
      .select();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-2xl">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Ro'yxatdan o'tish
        </h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Parol"
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-xl transition duration-300"
        >
          {loading ? "Yuklanmoqda..." : "Ro'yxatdan o'tish"}
        </button>
        <p className="text-center text-gray-600">
          Allaqachon hisobingiz bormi?{" "}
          <a
            href="/"
            className="text-indigo-500 hover:underline transition duration-300"
          >
            Kirish
          </a>
        </p>
      </div>
    </div>
  );
}
