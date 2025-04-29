import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { handleApiError } from './useApi';

interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

export function useApiQuery<T>(
  key: string[],
  fetchFn: () => Promise<ApiResponse<T>>,
  options?: Omit<UseQueryOptions<ApiResponse<T>, ApiError>, 'queryKey' | 'queryFn'>
): UseQueryResult<ApiResponse<T>, ApiError> {
  return useQuery<ApiResponse<T>, ApiError>({
    queryKey: key,
    queryFn: async () => {
      try {
        return await fetchFn();
      } catch (error) {
        handleApiError(error);
        throw error;
      }
    },
    ...options,
  });
} 