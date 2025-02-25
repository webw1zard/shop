import { createClient } from '@/supabase/client';
import React, { useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  role: string;
  order: Order[];
}
interface Order{
  amount: number;
}
const UserTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const supabase = createClient()

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from('users').select('id, email, role, orders');
      if (error) console.error( error);
      // @ts-expect-error
      else setUsers(data);
    };
    fetchUsers();
  }, []);

  const calculateAmount = (orders:Order[]) => {
    if (!orders || orders.length === 0) return 0;
    return orders.reduce((total, order) => total + (order.amount || 0), 0);
  };

  return (
    <div className="container mt-4">
      <h2>Users</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>№</th>
            <th>Status</th>
            <th>Email</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.role}</td>
                <td>{user.email}</td>
                <td>${calculateAmount(user.order)}</td>
                <td><button className="btn btn-secondary">Edit</button></td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center">No results.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
