'use client';

import { gql, useQuery } from '@apollo/client';

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
  const { loading, error, data } = useQuery(TEST_QUERY);

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Departments</h1>
      
      {loading && <p>Loading departments...</p>}
      
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
