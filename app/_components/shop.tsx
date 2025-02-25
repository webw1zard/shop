"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/supabase/client';

const Shop = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All Plants');
  const supabase = createClient()

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from('category').select('*');
      if (error) console.error(error);
      else setCategories(data);
    };

    const fetchProducts = async () => {
      const { data, error } = await supabase.from('products').select('*');
      if (error) console.error(error);
      else setProducts(data);
    };

    fetchCategories();
    fetchProducts();
  }, []);

  const filteredProducts = selectedCategory === 'All Plants' 
    ? products 
    : products.filter(product => product.category_id === selectedCategory);

  return (
    <div className="flex">
      <aside className="w-1/4 p-4">
        <h2 className="text-2xl font-bold mb-4">Categories</h2>
        <ul className="space-y-2">
          <li className={selectedCategory === 'All Plants' ? 'font-bold text-green-600' : ''} 
              onClick={() => setSelectedCategory('All Plants')}>
            All Plants
          </li>
          {categories.map(category => (
            <li key={category.id} className={selectedCategory === category.id ? 'font-bold text-green-600' : ''}
                onClick={() => setSelectedCategory(category.id)}>
              {category.name}
            </li>
          ))}
        </ul>
      </aside>

      <section className="w-3/4 grid grid-cols-3 gap-4 p-4">
        {filteredProducts.map(product => (
          <div key={product.id} className="border rounded-lg p-4 shadow-md hover:shadow-lg transition">
            <img src={product.image_url} alt={product.name} className="w-full h-64 object-cover rounded-lg mb-4" />
            <h3 className="text-xl font-bold mb-2">{product.name}</h3>
            <p className="text-green-600 font-semibold mb-2">${product.price}</p>
            <Link href={`/product/${product.id}`} className="text-blue-500 hover:underline">View Details</Link>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Shop;
