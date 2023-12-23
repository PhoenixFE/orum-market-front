import { useState } from 'react';
import { useMutation } from 'react-query';
import { api } from '../api/api';

interface FilePreview {
  id: string;
  path: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useFileUpload = () => {
  const [filePreview, setFilePreview] = useState<FilePreview[]>([]);

  const uploadFileMutation = useMutation<any, Error, FormData>(
    (newFiles) => api.uploadFile(newFiles),
    {
      onSuccess: (response) => {
        const files = response.data.files || [response.data.file];
        const newPreviews = files.map((file: File) => ({
          id: file.name,
          path: `${API_BASE_URL}${(file as any).path}`,
        }));
        setFilePreview((currentPreviews) => [
          ...currentPreviews,
          ...newPreviews,
        ]);
      },
      onError: (error) => {
        console.error('Error uploading file:', error);
      },
    },
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = e.target.files;
    if (files) {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append('attach', file as Blob);
      });
      uploadFileMutation.mutate(formData);
    }
  };

  const handleFileRemove = (id: string) => {
    setFilePreview((prev) => prev.filter((file) => file.id !== id));
  };

  return {
    filePreview,
    handleFileUpload,
    handleFileRemove,
    isUploading: uploadFileMutation.isLoading,
  };
};
