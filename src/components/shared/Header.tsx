'use client';

import { useAuth } from "@/contexts/auth-context";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col gap-2 mb-8">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="flex justify-between items-center gap-4">
        <span className="text-gray-600">Welcome, {user?.username}!</span>
        <button
          onClick={logout}
          className="px-4 py-2 text-sm text-white bg-red-500 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
