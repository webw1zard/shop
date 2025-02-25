"use client";
import { createClient } from "@/supabase/client";
import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import Rodal from "rodal";

interface Category {
  id: number;
  title: string;
  description: string;
  status: string;
}

export default function Category() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [Title, setTitle] = useState<string>("");
  const [Desc, setDesc] = useState<string>("");
  const supabase = createClient();

  const fetchCategories = async () => {
    const { data, error } = await supabase.from("category").select("*");
    if (error) console.error(error);
    else setCategories(data as Category[]);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((category) =>
    category.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async () => {
    if (editMode && selectedId) {
      const { error } = await supabase
        .from("category")
        .update({
          title: Title,
          description: Desc,
          status: "Draft",
          active: false,
        })
        .eq("id", selectedId);
      if (error) console.error(error);
    } else {
      const { error } = await supabase.from("category").insert([
        {
          title: Title,
          description: Desc,
          active: true,
          status: "Published",
        },
      ]);
      if (error) console.error(error);
    }
    fetchCategories();
    setIsVisible(false);
    setTitle("");
    setDesc("");
    setEditMode(false);
    setSelectedId(null);
  };

  const openEditModal = (id: number, title: string, desc: string) => {
    setTitle(title);
    setDesc(desc);
    setSelectedId(id);
    setEditMode(true);
    setIsVisible(true);
  };

  const openAddModal = () => {
    setTitle("");
    setDesc("");
    setEditMode(false);
    setIsVisible(true);
  };

  const DeleteCat = async (id: number) => {
    const { error } = await supabase.from("category").delete().eq("id", id);
    if (error) console.error(error);
    else fetchCategories();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by title..."
          className="border rounded px-4 py-2 w-full max-w-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2"
          onClick={openAddModal}
        >
          <FiPlus /> Add New
        </button>
      </div>
      <table className="min-w-full bg-white border rounded">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border">№</th>
            <th className="py-2 px-4 border">Title</th>
            <th className="py-2 px-4 border">Description</th>
            <th className="py-2 px-4 border">Published</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategories.map((category, index) => (
            <tr key={category.id}>
              <td className="py-2 px-4 border text-center">{index + 1}</td>
              <td className="py-2 px-4 border">{category.title}</td>
              <td className="py-2 px-4 border">{category.description}</td>
              <td className="py-2 px-4 border text-center">
                <span
                  className={`px-2 py-1 rounded text-white ${
                    category.status === "Published"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >
                  {category.status}
                </span>
              </td>
              <td className="py-2 px-4 border text-center flex flex-row gap-2 justify-center items-center">
                <button
                  className="btn btn-success"
                  onClick={() =>
                    openEditModal(
                      category.id,
                      category.title,
                      category.description
                    )
                  }
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => DeleteCat(category.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Rodal
        visible={isVisible}
        onClose={() => {
          setIsVisible(false);
          setEditMode(false);
          setSelectedId(null);
        }}
        customStyles={{ width: "600px", height: "400px" }}
      >
        <div className="flex flex-col justify-between items-center py-2 gap-3">
          <input
            type="text"
            placeholder="Title"
            className="form-control mt-5"
            value={Title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Description"
            className="form-control mt-2"
            value={Desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <button className="btn btn-success" onClick={handleSubmit}>
            {editMode ? "Update" : "Confirm"}
          </button>
        </div>
      </Rodal>
    </div>
  );
}
