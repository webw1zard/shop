import { createClient } from '@/supabase/client';
import React, { useEffect, useState } from 'react';
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  orders: Order[];
}

interface Order {
  amount: number;
}

const UserTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, role, orders');

      if (error) {
        console.error(error);
      } else {
        setUsers(data);
      }
    };
    fetchUsers();
  }, []);

  const calculateAmount = (orders: Order[]) => {
    if (!orders || orders.length === 0) return 0;
    return orders.reduce((total, order) => total + (order.amount || 0), 0);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) console.error(error);
    else setUsers(users.filter(user => user.id !== id));
  };

  const handleEdit = (user: User) => {
    setEditUser(user);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (editUser) {
      const { error } = await supabase
        .from('users')
        .update({
          name: editUser.name,
          email: editUser.email,
          role: editUser.role,
        })
        .eq('id', editUser.id);

      if (error) {
        console.error(error);
      } else {
        setUsers(users.map(user => (user.id === editUser.id ? editUser : user)));
        setIsModalOpen(false);
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2>Users</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>№</th>
            <th>Status</th>
            <th>Name</th>
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
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>${calculateAmount(user.orders)}</td>
                <td>
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger ms-2"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center">
                No results.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Rodal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        customStyles={{ width: '400px', height: '400px' }}
      >
        <h4>Edit User</h4>
        {editUser && (
          <div>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                value={editUser.name}
                onChange={e =>
                  setEditUser({ ...editUser, name: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={editUser.email}
                onChange={e =>
                  setEditUser({ ...editUser, email: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Role</label>
              <input
                type="text"
                className="form-control"
                value={editUser.role}
                onChange={e =>
                  setEditUser({ ...editUser, role: e.target.value })
                }
              />
            </div>
            <button className="btn btn-primary" onClick={handleSave}>
              Save
            </button>
          </div>
        )}
      </Rodal>
    </div>
  );
};

export default UserTable;
