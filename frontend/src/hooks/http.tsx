import { createSignal, createResource, onCleanup } from 'solid-js';
import toast from 'solid-toast';
import { IsLoading } from '../../globalTypes';

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = createSignal<IsLoading>();
  const [error, setError] = createSignal(null);
  const [activeHttpRequests, setActiveHttpRequests] = createSignal([]);

  type Method = 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';

  const sendRequest = async (
    url: string,
    method: Method | null = 'GET',
    body: string | null = null,
    headers = {}
  ) => {
    setIsLoading('true');
    const httpAbortCtrl = new AbortController();
    setActiveHttpRequests([...activeRequests, httpAbortCtrl]);

    try {
      const response = createResource<unknown>(
        await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal,
        })
      );

      const responseData = await response.json();

      setActiveHttpRequests(
        activeHttpRequests.filter((reqCtrl) => reqCtrl !== httpAbortCtrl)
      );

      if (!response.ok) {
        toast.error(responseData.message);
        throw new Error(responseData.message);
      }

      setIsLoading();

      return responseData;
    } catch (err) {
      setError(err.message);
      setIsLoading();
      throw err;
    }
  };

  const clearError = () => {
    setError(null);
  };

  onCleanup(() =>
    activeHttpRequests().forEach((abortCtrl) => abortCtrl.abort())
  );

  return { isLoading, error, sendRequest, clearError };
};
