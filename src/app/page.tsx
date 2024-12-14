"use client";

import { useProtectedRoute } from "@/hooks/use-protected-route";
import { useAuth } from "@/contexts/auth-context";
import { DepartmentList } from "@/components/departments/DepartmentList";
import { DepartmentForm } from "@/components/departments/DepartmentForm";
import { Header } from "@/components/shared/Header";
import { useState } from "react";

export default function Home() {
  const { token, isLoading } = useAuth();
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
      <Header title="Departments" />

      {showCreateForm ? (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Create New Department</h2>
          <DepartmentForm
            onCancel={() => setShowCreateForm(false)}
            onSuccess={() => setShowCreateForm(false)}
          />
        </div>
      ) : (
        <button
          onClick={() => setShowCreateForm(true)}
          className="mb-8 px-4 py-2 text-sm text-white bg-indigo-600 rounded hover:bg-indigo-700"
        >
          Create Department
        </button>
      )}

      <DepartmentList />
    </div>
  );
}
