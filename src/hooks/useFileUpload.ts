import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { api } from '../api/api';

interface FilePreview {
  id: string;
  path: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useFileUpload = (originalFiles: FilePreview[] = []) => {
  const [filePreview, setFilePreview] = useState<FilePreview[]>();

  useEffect(() => {
    if (originalFiles && originalFiles.length > 0) {
      setFilePreview(originalFiles);
    }
  }, [originalFiles]);

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
          ...(currentPreviews || []),
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
      if (files.length + (filePreview ? filePreview.length : 0) > 10) {
        console.log('filePreview', filePreview);
        console.log('files', files);
        alert(
          `You can only upload ${
            10 - (filePreview ? filePreview.length : 0)
          } more file(s).`,
        );
        return;
      }
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append('attach', file as Blob);
      });
      uploadFileMutation.mutate(formData);
    }
    if (e.target) {
      e.target.value = '';
    }
    console.log('filePreview', filePreview);
    console.log('files', files);
  };

  const handleFileRemove = (id: string) => {
    setFilePreview((prev) =>
      prev ? prev.filter((file) => file.id !== id) : [],
    );
  };

  return {
    filePreview,
    handleFileUpload,
    handleFileRemove,
    isUploading: uploadFileMutation.isLoading,
  };
};
