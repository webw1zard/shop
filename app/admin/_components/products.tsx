"use client";
import { createClient } from "@/supabase/client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import Skeleton from "react-loading-skeleton";
import { toast, ToastContainer } from "react-toastify";
import Rodal from "rodal";

interface CategoryType {
  id: string;
  name: string;
  desc: string;
  active: boolean;
}

interface ProductType {
  id: number;
  name: string;
  desc: string;
  price: number;
  category_id: string;
  active: boolean;
  images: string[];
}

export default function Products() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState(0);
  const [categoryId, setCategoryId] = useState("");
  const [active, setActive] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [openRodal, setOpenRodal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState<number | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchProducts();
    fetchCategory();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from("Shop_Products").select("*");
    if (error) {
      toast.error("Mahsulotlarni yuklashda xatolik!");
      console.error(error);
    } else {
      setProducts(data);
      setLoading(false);
    }
  };

  const fetchCategory = async () => {
    const { data, error } = await supabase.from("Shop_Category").select("*");
    if (error) {
      toast.error("Kategoriyalarni yuklashda xatolik!");
      console.error(error);
    } else {
      setCategories(data);
    }
  };

  const handleAddProduct = async () => {
    if (!name || !desc || !price || !categoryId || !images.length) {
      toast.error("Barcha maydonlarni to'ldiring!");
      return;
    }

    setLoading(true);

    if (current === null) {
      const { error } = await supabase.from("Shop_Products").insert([
        {
          name,
          desc,
          price,
          category_id: categoryId,
          active,
          images,
        },
      ]);
      if (error) {
        toast.error("Mahsulot qo'shishda xatolik!");
        console.error(error);
      } else {
        toast.success("Mahsulot muvaffaqiyatli qo'shildi!");
      }
    } else {
      const { error } = await supabase
        .from("Shop_Products")
        .update({
          name,
          desc,
          price,
          category_id: categoryId,
          active,
          images,
        })
        .eq("id", current);
      if (error) {
        toast.error("Mahsulotni yangilashda xatolik!");
        console.error(error);
      } else {
        toast.success("Mahsulot muvaffaqiyatli yangilandi!");
      }
    }

    setOpenRodal(false);
    fetchProducts();
    setName("");
    setDesc("");
    setPrice(0);
    setActive(false);
    setCategoryId("");
    setImages([]);
    setCurrent(null);
    setLoading(false);
  };

  const handleActive = async (id: number) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("Shop_Products")
      .select("active")
      .eq("id", id)
      .single();

    if (error) {
      toast.error("Holatni yangilashda xatolik!");
      console.error(error);
      return;
    }

    if (data) {
      const newStatus = !data.active;
      const { error: updateError } = await supabase
        .from("Shop_Products")
        .update({ active: newStatus })
        .eq("id", id);

      if (updateError) {
        toast.error("Holatni yangilashda xatolik yuz berdi!");
        console.error(updateError);
      } else {
        toast.success("Holat muvaffaqiyatli o'zgartirildi!");
        fetchProducts();
        setLoading(false);
      }
    }
  };
  

  const handleDelete = async (id: number) => {
    setLoading(true);
    const { error } = await supabase
      .from("Shop_Products")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Mahsulot o‘chirishda xatolik yuz berdi!");
      console.error(error);
    } else {
      toast.success("Mahsulot muvaffaqiyatli o‘chirildi!");
      fetchProducts();
      setLoading(false);
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0];
    const { data, error } = await supabase.storage
      .from("Products_Image")
      .upload(`products/${Date.now()}.jpg`, file);

    if (error) {
      toast.error("Rasm yuklashda xatolik yuz berdi!");
    } else {
      toast.success("Rasm muvaffaqiyatli yuklandi!");
      setImages([...images, data.fullPath]);
    }
  };

  const handleUpdate = (product: ProductType) => {
    setCurrent(product.id);
    setName(product.name);
    setDesc(product.desc);
    setPrice(product.price);
    setCategoryId(product.category_id);
    setActive(product.active);
    setImages(product.images);
    setOpenRodal(true);
  };

  return (
    <div className="flex">
      <div className="w-full py-10 px-10">
        <ToastContainer />
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-bold">Products</h1>
          <button
            onClick={() => setOpenRodal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center gap-2 focus:scale-75 transition-all duration-300"
          >
            + Add New
          </button>
        </div>
        <table className="table table-light table-hover">
          <thead>
            <tr>
              <th>№</th>
              <th>Image</th>
              <th>Title</th>
              <th>Description</th>
              <th>Category</th>
              <th>Price</th>
              <th>Published</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 7 }).map((_, index) => (
                  <tr key={index}>
                    <td>
                      <Skeleton width={300} />
                    </td>
                    <td>
                      <Skeleton width={120} />
                    </td>
                    <td>
                      <Skeleton width={120} />
                    </td>
                    <td>
                      <Skeleton width={180} />
                    </td>
                    <td>
                      <Skeleton width={80} />
                    </td>
                    <td>
                      <Skeleton width={100} />
                    </td>
                    <td>
                      <Skeleton width={100} />
                    </td>
                    <td>
                      <Skeleton width={100} />
                    </td>
                  </tr>
                ))
              : products.map((product: ProductType, index) => {
                  const category = categories.find(
                    (cat) => cat.id === product.category_id
                  );
                  return (
                    <tr key={product.id}>
                      <td>{index + 1}</td>
                      <td className="flex items-center gap-2">
                        {product.images.map((img) => (
                          <img
                            key={img}
                            src={
                              "https://dijgblooocqejrsjbsto.supabase.co/storage/v1/object/public/" +
                              img
                            }
                            alt=""
                            className="w-10 h-10 hover:scale-125 duration-200 rounded-sm"
                          />
                        ))}
                      </td>
                      <td>{product.name}</td>
                      <td>{product.desc}</td>
                      <td>{category ? category.name : "Noma'lum"}</td>
                      
                      <td>{product.price}</td>
                      <td>
                        <button
                          onClick={() => handleActive(product.id)}
                          className={`btn btn-sm ${
                            product.active ? "btn-success" : "btn-danger"
                          }`}
                        >
                          {product.active ? "Published" : "Draft"}
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={() => handleUpdate(product)}
                          className="btn btn-primary mr-2"
                        >
                          <MdEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="btn btn-danger"
                        >
                          <MdDelete />
                        </button>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>
      <Rodal
        height={700}
        visible={openRodal}
        onClose={() => setOpenRodal(false)}
      >
        <div className="pt-4 flex flex-col justify-between h-full">
          <div>
            <h1 className="text-2xl font-bold">Add New Product</h1>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control mb-2"
              type="text"
              placeholder="name..."
            />
            <input
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="form-control mb-2"
              type="text"
              placeholder="description..."
            />
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="form-control mb-2"
            >
              <option value="" disabled>
                Products Category
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <input
              value={price}
              onChange={(e) => setPrice(parseInt(e.target.value))}
              className="form-control mb-2"
              type="number"
              placeholder="price..."
            />
            <div className="flex justify-between items-center">
              <p className="text-gray-500 font-bold mb-2">Active</p>
              <input
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                type="checkbox"
                className="form-check-input mb-2"
              />
            </div>
            <div className="shadow-lg p-4 rounded-lg mb-2">
              <label htmlFor="image">
                Product Image
                <input onChange={handleUpload} id="image" type="file" hidden />
              </label>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {images.map((img) => (
                <img
                  key={img}
                  src={
                    "https://dijgblooocqejrsjbsto.supabase.co/storage/v1/object/public/" +
                    img
                  }
                  alt=""
                  className="w-32 h-32"
                />
              ))}
            </div>
          </div>
          <button onClick={handleAddProduct} className="btn btn-success w-full">
            Add Product
          </button>
        </div>
      </Rodal>
    </div>
  );
}