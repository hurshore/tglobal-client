'use client';

import { gql, useQuery } from '@apollo/client';
import { DepartmentCard } from './DepartmentCard';
import { Pagination } from './Pagination';
import { SearchBar } from './SearchBar';
import { useState } from 'react';

export const DEPARTMENTS_QUERY = gql`
  query GetDepartments($page: Int!, $limit: Int!) {
    departments(pagination: { page: $page, limit: $limit }) {
      items {
        id
        name
        subDepartments {
          id
          name
        }
      }
      total
      page
      limit
      hasMore
    }
  }
`;

interface Department {
  id: string;
  name: string;
  subDepartments: { id: string; name: string; }[];
}

interface DepartmentsData {
  departments: {
    items: Department[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

export function DepartmentList() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const limit = 10;

  const { loading, error, data, refetch } = useQuery<DepartmentsData>(DEPARTMENTS_QUERY, {
    variables: {
      page,
      limit,
    },
  });

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    setPage(1);
    if (term) {
      try {
        const result = await refetch();
        // If we want to filter by name, we'll need to do it client-side
        // since the backend doesn't support name filtering
      } catch (error) {
        console.error('Error searching departments:', error);
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (loading) return <div className="text-center py-4">Loading departments...</div>;
  if (error) return <div className="text-red-500 py-4">Error: {error.message}</div>;

  const { items: departments, total, hasMore } = data?.departments || { items: [], total: 0, hasMore: false };

  // Client-side filtering since the backend doesn't support it
  const filteredDepartments = searchTerm
    ? departments.filter(dept => 
        dept.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : departments;

  return (
    <div className="space-y-6">
      <SearchBar onSearch={handleSearch} />
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredDepartments.map((dept) => (
          <DepartmentCard 
            key={dept.id} 
            department={dept}
            onRefetch={refetch}
          />
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalItems={total}
        itemsPerPage={limit}
        hasMore={hasMore}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
