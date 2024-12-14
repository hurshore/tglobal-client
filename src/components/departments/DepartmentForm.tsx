'use client';

import { gql, useMutation } from '@apollo/client';
import { useState } from 'react';
import { DEPARTMENTS_QUERY } from './DepartmentList';

const CREATE_DEPARTMENT = gql`
  mutation CreateDepartment($input: CreateDepartmentInput!) {
    createDepartment(input: $input) {
      id
      name
      subDepartments {
        id
        name
      }
    }
  }
`;

const UPDATE_DEPARTMENT = gql`
  mutation UpdateDepartment($input: UpdateDepartmentInput!) {
    updateDepartment(input: $input) {
      id
      name
      subDepartments {
        id
        name
      }
    }
  }
`;

interface Department {
  id: string;
  name: string;
  subDepartments: { id: string; name: string }[];
}

interface DepartmentFormProps {
  department?: Department;
  onCancel: () => void;
  onSuccess: () => void;
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

export function DepartmentForm({ department, onCancel, onSuccess }: DepartmentFormProps) {
  const [name, setName] = useState(department?.name || '');
  const [subDepartments, setSubDepartments] = useState<string[]>(
    department?.subDepartments?.map(sub => sub.name) || ['']
  );

  const [createDepartment, { loading: createLoading }] = useMutation(CREATE_DEPARTMENT, {
    update(cache, { data: { createDepartment } }) {
      const existingData = cache.readQuery<DepartmentsData>({
        query: DEPARTMENTS_QUERY,
        variables: { page: 1, limit: 10 }
      });
      
      if (existingData) {
        cache.writeQuery<DepartmentsData>({
          query: DEPARTMENTS_QUERY,
          variables: { page: 1, limit: 10 },
          data: {
            departments: {
              ...existingData.departments,
              items: [createDepartment, ...existingData.departments.items],
              total: existingData.departments.total + 1
            }
          }
        });
      }
    },
    onCompleted: () => {
      onSuccess();
    }
  });

  const [updateDepartment, { loading: updateLoading }] = useMutation(UPDATE_DEPARTMENT, {
    update(cache, { data: { updateDepartment } }) {
      const existingData = cache.readQuery<DepartmentsData>({
        query: DEPARTMENTS_QUERY,
        variables: { page: 1, limit: 10 }
      });
      
      if (existingData) {
        const updatedItems = existingData.departments.items.map((item: Department) => 
          item.id === updateDepartment.id ? updateDepartment : item
        );
        
        cache.writeQuery<DepartmentsData>({
          query: DEPARTMENTS_QUERY,
          variables: { page: 1, limit: 10 },
          data: {
            departments: {
              ...existingData.departments,
              items: updatedItems
            }
          }
        });
      }
    },
    onCompleted: () => {
      onSuccess();
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const filteredSubDepartments = subDepartments.filter(name => name.trim() !== '');
    
    try {
      if (department) {
        // For update, we only send the id and name
        await updateDepartment({
          variables: {
            input: {
              id: parseInt(department.id),
              name,
            },
          },
        });

        // If there are new sub-departments, we'll need to create them separately
        // This would require additional mutations for sub-departments
      } else {
        await createDepartment({
          variables: {
            input: {
              name,
              subDepartments: filteredSubDepartments.map(name => ({ name })),
            },
          },
        });
      }
    } catch (error) {
      console.error('Error saving department:', error);
    }
  };

  const addSubDepartment = () => {
    setSubDepartments([...subDepartments, '']);
  };

  const removeSubDepartment = (index: number) => {
    setSubDepartments(subDepartments.filter((_, i) => i !== index));
  };

  const updateSubDepartment = (index: number, value: string) => {
    const newSubDepartments = [...subDepartments];
    newSubDepartments[index] = value;
    setSubDepartments(newSubDepartments);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Department Name
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

      {!department && ( // Only show sub-departments section for new departments
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Sub Departments
          </label>
          {subDepartments.map((subDept, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={subDept}
                onChange={(e) => updateSubDepartment(index, e.target.value)}
                className="block w-full px-3 py-2 bg-white text-gray-900 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Sub Department Name"
              />
              <button
                type="button"
                onClick={() => removeSubDepartment(index)}
                className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addSubDepartment}
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Add Sub Department
          </button>
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
          {createLoading || updateLoading ? 'Saving...' : department ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}
