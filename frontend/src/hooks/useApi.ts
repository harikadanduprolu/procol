import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';

// Generic type for API response
interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

// Generic type for API error
interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

// Custom hook for GET requests
export function useApiQuery<T>(
  key: string[],
  fetchFn: () => Promise<ApiResponse<T>>,
  options?: Omit<UseQueryOptions<ApiResponse<T>, ApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<ApiResponse<T>, ApiError>({
    queryKey: key,
    queryFn: fetchFn,
    ...options,
  });
}

// Custom hook for POST/PUT/DELETE requests
export function useApiMutation<T, V>(
  mutationFn: (variables: V) => Promise<ApiResponse<T>>,
  options?: Omit<UseMutationOptions<ApiResponse<T>, ApiError, V>, 'mutationFn'>
) {
  return useMutation<ApiResponse<T>, ApiError, V>({
    mutationFn,
    ...options,
  });
}

// Helper function to handle API errors
export function handleApiError(error: any) {
  const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
  
  toast({
    title: "Error",
    description: errorMessage,
    variant: "destructive",
  });
  
  return error;
}

// Helper function to show success toast
export function showSuccessToast(message: string) {
  toast({
    title: "Success",
    description: message,
    variant: "default",
  });
} 