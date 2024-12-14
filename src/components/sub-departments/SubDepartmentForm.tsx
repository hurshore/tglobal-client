'use client';

import { gql, useMutation, useQuery } from '@apollo/client';
import { useState } from 'react';
import { SUB_DEPARTMENTS_QUERY } from './SubDepartmentList';

const CREATE_SUB_DEPARTMENT = gql`
  mutation CreateSubDepartment($departmentId: Int!, $input: CreateSubDepartmentInput!) {
    createSubDepartment(departmentId: $departmentId, input: $input) {
      id
      name
      department {
        id
        name
      }
    }
  }
`;

const UPDATE_SUB_DEPARTMENT = gql`
  mutation UpdateSubDepartment($input: UpdateSubDepartmentInput!) {
    updateSubDepartment(input: $input) {
      id
      name
      department {
        id
        name
      }
    }
  }
`;

const GET_DEPARTMENTS = gql`
  query GetDepartmentsForSelect {
    departments(pagination: { page: 1, limit: 100 }) {
      items {
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

interface SubDepartmentFormProps {
  subDepartment?: SubDepartment;
  onCancel: () => void;
  onSuccess: () => void;
}

interface Department {
  id: string;
  name: string;
}

interface DepartmentsData {
  departments: {
    items: Department[];
  };
}

export function SubDepartmentForm({ subDepartment, onCancel, onSuccess }: SubDepartmentFormProps) {
  const [name, setName] = useState(subDepartment?.name || '');
  const [departmentId, setDepartmentId] = useState(subDepartment?.department.id || '');

  const { data: departmentsData } = useQuery<DepartmentsData>(GET_DEPARTMENTS);

  const [createSubDepartment, { loading: createLoading }] = useMutation(CREATE_SUB_DEPARTMENT, {
    update(cache, { data: { createSubDepartment } }) {
      const existingData = cache.readQuery<{ subDepartments: SubDepartment[] }>({
        query: SUB_DEPARTMENTS_QUERY,
      });
      
      if (existingData) {
        cache.writeQuery({
          query: SUB_DEPARTMENTS_QUERY,
          data: {
            subDepartments: [...existingData.subDepartments, createSubDepartment],
          },
        });
      }
    },
    onCompleted: () => {
      onSuccess();
    },
  });

  const [updateSubDepartment, { loading: updateLoading }] = useMutation(UPDATE_SUB_DEPARTMENT, {
    update(cache, { data: { updateSubDepartment } }) {
      const existingData = cache.readQuery<{ subDepartments: SubDepartment[] }>({
        query: SUB_DEPARTMENTS_QUERY,
      });
      
      if (existingData) {
        const updatedSubDepartments = existingData.subDepartments.map(item =>
          item.id === updateSubDepartment.id ? updateSubDepartment : item
        );
        
        cache.writeQuery({
          query: SUB_DEPARTMENTS_QUERY,
          data: {
            subDepartments: updatedSubDepartments,
          },
        });
      }
    },
    onCompleted: () => {
      onSuccess();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (subDepartment) {
        await updateSubDepartment({
          variables: {
            input: {
              id: parseInt(subDepartment.id),
              name,
            },
          },
        });
      } else {
        await createSubDepartment({
          variables: {
            departmentId: parseInt(departmentId),
            input: {
              name,
            },
          },
        });
      }
    } catch (error) {
      console.error('Error saving sub-department:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Sub-Department Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      {!subDepartment && (
        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
            Department
          </label>
          <select
            id="department"
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          >
            <option value="">Select a department</option>
            {departmentsData?.departments.items.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={createLoading || updateLoading}
          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400"
        >
          {createLoading || updateLoading ? 'Saving...' : subDepartment ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}
