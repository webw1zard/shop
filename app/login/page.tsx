"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/supabase/client";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setUser(data.session.user);
      }
    };
    getSession();
  }, []);

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) alert(error.message);
    else setUser(data.user);
  };

  const handleRegister = () => {
    router.push("/register");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) alert(error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-2xl">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Xush kelibsiz
        </h2>
        {user ? (
          <div className="text-center">
            <p className="text-lg">Salom, {user.email}</p>
            <button
              onClick={handleLogout}
              className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-xl transition duration-300"
            >
              Chiqish
            </button>
          </div>
        ) : (
          <>
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
              onClick={handleLogin}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-xl transition duration-300"
            >
              Kirish
            </button>
            <button
              onClick={handleRegister}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-xl transition duration-300"
            >
              Ro'yxatdan o'tish
            </button>
            <div className="relative flex py-5 items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-gray-500">yoki</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-xl transition duration-300 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 48 48">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.63 1.22 9.1 3.2l6.8-6.8C34.55 2.1 29.5 0 24 0 14.64 0 6.63 5.64 2.64 13.76l7.96 6.2C12.48 13.44 17.78 9.5 24 9.5z"
                />
                <path
                  fill="#34A853"
                  d="M46.09 24.5c0-1.37-.11-2.68-.31-3.97H24v7.53h12.52c-.54 2.68-2.1 4.95-4.44 6.45v5.36h7.17c4.2-3.87 6.84-9.57 6.84-15.37z"
                />
                <path
                  fill="#4A90E2"
                  d="M8.77 29.96c-1.33-2.36-2.1-5.07-2.1-7.96s.77-5.6 2.1-7.96V9.5H1.64C.6 12.14 0 15.02 0 18s.6 5.86 1.64 8.5l7.13-5.54z"
                />
                <path
                  fill="#FBBC05"
                  d="M24 38c-4.56 0-8.45-1.5-11.25-4.06l-7.13 5.54C6.63 42.36 14.64 48 24 48c5.5 0 10.55-2.1 14.9-5.9l-7.17-5.36c-2.3 1.53-5.13 2.4-7.73 2.4z"
                />
              </svg>
              <span>Google bilan kirish</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
