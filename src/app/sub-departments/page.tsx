'use client';

import { useProtectedRoute } from '@/hooks/use-protected-route';
import { useAuth } from '@/contexts/auth-context';
import { SubDepartmentList } from '@/components/sub-departments/SubDepartmentList';
import { SubDepartmentForm } from '@/components/sub-departments/SubDepartmentForm';
import { useState } from 'react';

export default function SubDepartmentsPage() {
  const { user, logout, token, isLoading } = useAuth();
  const isAuthenticated = useProtectedRoute();
  const [showCreateForm, setShowCreateForm] = useState(false);

  if (isLoading) {
    return <div className="min-h-screen p-8">Loading...</div>;
  }

  if (!isAuthenticated || !token) {
    return null; // The useProtectedRoute hook will handle the redirect
  }

  return (
    <div className="min-h-screen p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Sub-Departments</h1>
        <div className="flex items-center gap-4">
          <span>Welcome, {user?.username}!</span>
          <button
            onClick={logout}
            className="px-4 py-2 text-sm text-white bg-red-500 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {showCreateForm ? (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Create New Sub-Department</h2>
          <SubDepartmentForm
            onCancel={() => setShowCreateForm(false)}
            onSuccess={() => setShowCreateForm(false)}
          />
        </div>
      ) : (
        <button
          onClick={() => setShowCreateForm(true)}
          className="mb-8 px-4 py-2 text-sm text-white bg-indigo-600 rounded hover:bg-indigo-700"
        >
          Create Sub-Department
        </button>
      )}

      <SubDepartmentList />
    </div>
  );
}
