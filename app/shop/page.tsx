"use client"
import React, { useEffect, useState } from "react";
import { createClient } from "@/supabase/client";

const [products, setProducts] = useState();
const supabase = createClient();
useEffect(() => {
  supabase
    .from("products")
    .select("*")
    .then((res: any) => {
      setProducts(res.data);
    });
});
const page = () => {
  return <div>{}</div>;
};

export default page;
