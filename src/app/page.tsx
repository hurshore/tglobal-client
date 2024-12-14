'use client';

import { gql, useQuery } from '@apollo/client';
import { useProtectedRoute } from '@/hooks/use-protected-route';
import { useAuth } from '@/contexts/auth-context';

const TEST_QUERY = gql`
  query {
    departments(pagination: { page: 1, limit: 10 }) {
      items {
        id
        name
      }
      total
      page
      limit
      hasMore
    }
  }
`;

export default function Home() {
  const { user, logout, token, isLoading } = useAuth();
  const isAuthenticated = useProtectedRoute();

  const { loading: queryLoading, error, data } = useQuery(TEST_QUERY, {
    skip: !token || !isAuthenticated,
    onError: (error) => {
      console.error('GraphQL Error:', error);
      // Only logout if it's truly an auth error
      if (error.message.toLowerCase().includes('unauthorized')) {
        logout();
      }
    }
  });

  if (isLoading) {
    return <div className="min-h-screen p-8">Loading...</div>;
  }

  if (!isAuthenticated || !token) {
    return null; // The useProtectedRoute hook will handle the redirect
  }

  return (
    <div className="min-h-screen p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Departments</h1>
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
      
      {queryLoading && <p>Loading departments...</p>}
      
      {error && (
        <p className="text-red-500">
          Error: {error.message}
        </p>
      )}
      
      {data && (
        <div className="space-y-4">
          <p>Total Departments: {data.departments.total}</p>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {data.departments.items.map((dept: any) => (
              <div 
                key={dept.id}
                className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <h2 className="font-semibold">{dept.name}</h2>
                <p className="text-sm text-gray-500">ID: {dept.id}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
