import { useState } from 'react';
import { handleApiError, showSuccessToast } from './useApi';

interface UseFormSubmitOptions<T> {
  onSubmit: (data: T) => Promise<any>;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
  successMessage?: string;
}

export function useFormSubmit<T>({
  onSubmit,
  onSuccess,
  onError,
  successMessage = 'Operation completed successfully',
}: UseFormSubmitOptions<T>) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: T) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await onSubmit(data);
      
      if (successMessage) {
        showSuccessToast(successMessage);
      }
      
      if (onSuccess) {
        onSuccess(response);
      }
      
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'An error occurred. Please try again.';
      setError(errorMessage);
      
      if (onError) {
        onError(err);
      } else {
        handleApiError(err);
      }
      
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleSubmit,
    isLoading,
    error,
  };
} 