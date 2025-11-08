"use client";

import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

interface User {
  email: string;
}

const Header = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      try {
        const decodedToken = jwtDecode<User>(token);
        setUser(decodedToken);
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem('jwt');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    setUser(null);
    window.location.href = '/'; // Refresh to show login component
  };

  return (
    <header className="bg-base-200 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">MixChat</h1>
        <div>
          {user ? (
            <div className="flex items-center gap-4">
              <span>Welcome, {user.email}!</span>
              <button onClick={handleLogout} className="btn btn-sm btn-outline">
                Logout
              </button>
            </div>
          ) : (
            <span className="text-sm">Not logged in</span>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
