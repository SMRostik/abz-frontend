import React, { useEffect, useState } from 'react';
import '../styles/UserList.scss'

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  photo: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchUsers = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/users?page=${page}&count=6`); // Передати параметри для пагінації
      const data = await response.json();

      if (data.success) {
        setUsers((prevUsers) => [...prevUsers, ...data.users]);
        setHasMore(data.users.length === 6); 
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  return (
    <div className="user-list-container">
      <h1>User List</h1>
      <div className="card-grid">
        {users.map((user) => (
          <div className="card" key={user.id}>
            <img src={user.photo} alt="" />
            <h2>{user.name}</h2>
            <p>Email: {user.email}</p>
            <p>Phone: {user.phone}</p>
          </div>
        ))}
      </div>
      {hasMore && (
        <button className="load-more" onClick={() => setPage((prev) => prev + 1)} disabled={loading}>
          {loading ? 'Loading...' : 'Більше'}
        </button>
      )}
      {!hasMore && <p>Більше користувачів немає.</p>}
    </div>
  );
};

export default UserList;