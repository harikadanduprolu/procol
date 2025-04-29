import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { handleApiError, showSuccessToast } from './useApi';

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

export function useApiMutation<T, V>(
  mutationFn: (variables: V) => Promise<ApiResponse<T>>,
  options?: Omit<UseMutationOptions<ApiResponse<T>, ApiError, V>, 'mutationFn'> & {
    successMessage?: string;
  }
): UseMutationResult<ApiResponse<T>, ApiError, V> {
  const { successMessage, ...restOptions } = options || {};

  return useMutation<ApiResponse<T>, ApiError, V>({
    mutationFn: async (variables) => {
      try {
        return await mutationFn(variables);
      } catch (error) {
        handleApiError(error);
        throw error;
      }
    },
    onSuccess: (data, variables, context) => {
      if (successMessage) {
        showSuccessToast(successMessage);
      }
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    ...restOptions,
  });
} 