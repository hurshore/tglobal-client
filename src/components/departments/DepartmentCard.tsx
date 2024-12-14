'use client';

import { gql, useMutation } from '@apollo/client';
import { useState } from 'react';
import { DepartmentForm } from './DepartmentForm';

const DELETE_DEPARTMENT = gql`
  mutation RemoveDepartment($id: Int!) {
    removeDepartment(id: $id)
  }
`;

interface Department {
  id: string;
  name: string;
  subDepartments: { id: string; name: string; }[];
}

interface DepartmentCardProps {
  department: Department;
  onRefetch: () => void;
}

export function DepartmentCard({ department, onRefetch }: DepartmentCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [deleteDepartment, { loading: deleteLoading }] = useMutation(DELETE_DEPARTMENT, {
    onCompleted: () => {
      setShowDeleteConfirm(false);
      onRefetch();
    },
  });

  const handleDelete = async () => {
    try {
      await deleteDepartment({
        variables: { id: parseInt(department.id, 10) },
      });
    } catch (error) {
      console.error('Error deleting department:', error);
    }
  };

  if (isEditing) {
    return (
      <DepartmentForm
        department={department}
        onCancel={() => setIsEditing(false)}
        onSuccess={() => {
          setIsEditing(false);
          onRefetch();
        }}
      />
    );
  }

  return (
    <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h2 className="font-semibold text-lg">{department.name}</h2>
          <p className="text-sm text-gray-500">ID: {department.id}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm px-2 py-1 text-blue-600 hover:text-blue-800"
          >
            Edit
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="text-sm px-2 py-1 text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </div>
      </div>

      {department.subDepartments.length > 0 && (
        <div className="mt-2">
          <h3 className="text-sm font-medium text-gray-700 mb-1">Sub-departments:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            {department.subDepartments.map((sub) => (
              <li key={sub.id}>{sub.name}</li>
            ))}
          </ul>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Delete</h3>
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete the department "{department.name}"?
              {department.subDepartments.length > 0 && (
                <span className="text-red-600 block mt-2 font-medium">
                  Warning: This will also delete {department.subDepartments.length} sub-departments.
                </span>
              )}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-400"
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
