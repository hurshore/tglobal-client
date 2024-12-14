"use client";

import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import { SearchBar } from "../departments/SearchBar";
import { SubDepartmentCard } from "./SubDepartmentCard";

export const SUB_DEPARTMENTS_QUERY = gql`
  query GetSubDepartments {
    subDepartments {
      id
      name
      department {
        id
        name
      }
    }
  }
`;

interface SubDepartment {
  id: string;
  name: string;
  department: {
    id: string;
    name: string;
  };
}

interface SubDepartmentsData {
  subDepartments: SubDepartment[];
}

export function SubDepartmentList() {
  const [searchTerm, setSearchTerm] = useState("");
  const { loading, error, data, refetch } = useQuery<SubDepartmentsData>(
    SUB_DEPARTMENTS_QUERY
  );

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  if (loading)
    return <div className="text-center py-4">Loading sub-departments...</div>;
  if (error)
    return <div className="text-red-500 py-4">Error: {error.message}</div>;

  const subDepartments = data?.subDepartments || [];
  const filteredSubDepartments = searchTerm
    ? subDepartments.filter(
        (subDept) =>
          subDept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          subDept.department.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      )
    : subDepartments;

  return (
    <div className="space-y-6">
      <SearchBar onSearch={handleSearch} />

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredSubDepartments.map((subDept) => (
          <SubDepartmentCard
            key={subDept.id}
            subDepartment={subDept}
            onRefetch={refetch}
          />
        ))}
      </div>

      {filteredSubDepartments.length === 0 && (
        <p className="text-center text-gray-500 py-4">
          {searchTerm
            ? "No sub-departments found matching your search."
            : "No sub-departments found."}
        </p>
      )}
    </div>
  );
}
