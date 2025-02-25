"use client";
import { createClient } from "@/supabase/client";
import { useEffect, useState, ChangeEvent } from "react";
import Rodal from "rodal";
import "rodal/lib/rodal.css";

interface Product {
  id?: number;
  name: string;
  description: string;
  categoryId: string;
  price: number;
  published: string;
  active:boolean;
  images: string[];
}

interface Category {
  id: string;
  title: string;
}

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [product, setProduct] = useState<Product>({
    name: "",
    description: "",
    categoryId: "",
    price: 0,
    published: "published",
    active:true,
    images: [],
  });
  const [files, setFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const supabase = createClient();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from("product").select("*");
    if (error) console.error(error);
    else setProducts(data as Product[]);
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase.from("category").select("id, title");
    if (error) console.error(error);
    else setCategories(data as Category[]);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      if (filesArray.length > 5) {
        alert("Maximum 4 images ");
        return;
      }
      setFiles(filesArray);

      const previewUrls = filesArray.map((file) => URL.createObjectURL(file));
      setPreviewImages(previewUrls);
    }
  };

  const handleDeleteImage = (index: number) => {
    const updatedFiles = [...files];
    const updatedPreviews = [...previewImages];
    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setFiles(updatedFiles);
    setPreviewImages(updatedPreviews);
  };

  const uploadImages = async () => {
    const imageUrls: string[] = [];
    for (const file of files) {
      const sanitizedFileName = file.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')  
        .replace(/-+/g, '-')         
        .replace(/^-|-$/g, '');      
  
      const { data, error } = await supabase.storage
        .from("products")
        .upload(`images/${Date.now()}_${sanitizedFileName}`, file);
        
      if (error) {
        console.error(error);
      } else {
        const publicUrl = supabase.storage
          .from("products")
          .getPublicUrl(data.path).data.publicUrl;
        imageUrls.push(publicUrl);
      }
    }
    return imageUrls;
  };
  

  const handleSave = async () => {
    const uploadedImages = await uploadImages();
    const newProduct = { ...product, images: uploadedImages };

    if (editMode) {
      const { error } = await supabase
        .from("product")
        .update(newProduct)
        .eq("id", product.id);
      if (error) console.error(error);
      else {
        setShowModal(false);
        fetchProducts();
      }
    } else {
      const { error } = await supabase.from("product").insert(newProduct);
      if (error) console.error(error);
      else {
        setShowModal(false);
        fetchProducts();
      }
    }
  };

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "price"
          ? parseFloat(value) || 0
          : value,
    }));
  };
  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("product").delete().eq("id", id);
    if (error) console.error(error);
    else fetchProducts();
  };

  return (
    <div className="container mt-4">
      <button className="btn btn-primary" onClick={() => setShowModal(true)}>
        + Add New
      </button>

      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>No</th>
            <th>Title</th>
            <th>Description</th>
            <th>Category</th>
            <th>Price</th>
            <th>Images</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>{item.categoryId}</td>
              <td>{item.price.toLocaleString()} UZS</td>
              <td>
                {item.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={item.name}
                    style={{ width: "50px", marginRight: "5px" }}
                  />
                ))}
              </td>
              <td>
                <button
                  className="btn btn-warning me-2"
                  onClick={() => {
                    setProduct(item);
                    setEditMode(true);
                    setShowModal(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(item.id as number)}
                >
                  Delete
                  </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Rodal
        visible={showModal}
        onClose={() => setShowModal(false)}
        width={500}
        height={600}
        customStyles={{ borderRadius: "10px" }}
      >
        <h4>{editMode ? "Edit Product" : "Add New Product"}</h4>
        <input
          type="text"
          placeholder="Name"
          name="name"
          value={product.name}
          onChange={handleChange}
          className="form-control mb-2"
        />
        <textarea
          placeholder="Description"
          name="description"
          value={product.description}
          onChange={handleChange}
          className="form-control mb-2"
        ></textarea>
        <select
          name="categoryId"
          value={product.categoryId}
          onChange={handleChange}
          className="form-control mb-2"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.title}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Price"
          name="price"
          value={product.price}
          onChange={handleChange}
          className="form-control mb-2"
        />
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="form-control mb-2"
        />
        <div className="d-flex flex-wrap">
          {previewImages.map((img, i) => (
            <div key={i} style={{ position: "relative" }}>
              <img
                src={img}
                alt={`Preview ${i}`}
                style={{ width: "50px", marginRight: "5px", marginBottom: "5px" }}
              />
              <button
                style={{ position: "absolute", top: 0, right: 0 }}
                onClick={() => handleDeleteImage(i)}
              >
                X
              </button>
            </div>
          ))}
        </div>
        <button onClick={handleSave} className="btn btn-success mt-3">
          {editMode ? "Update" : "Save"}
        </button>
      </Rodal>
    </div>
  );
};

export default ProductManagement;
