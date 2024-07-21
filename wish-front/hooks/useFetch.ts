import { setCookie } from "@/utils/cookies";
import { clearData, createData, readData } from "@/utils/storage";
import axios, { AxiosRequestConfig, Method } from "axios";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

axios.defaults.baseURL = "https://wishlinx.applikuapp.com";

let hasShownToast = false;

// Axios interceptor for handling 401 errors
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const currentPath = window.location.pathname;

      if (status === 401 && currentPath !== "/") {
        clearData("saitama-token");
        clearData("saitamaRefresh-token");
        setCookie("saitama-token", false);
        if (!hasShownToast) {
          toast.error("Session expired, please log out and log in again");
          hasShownToast = true;
        }
      }
    }
    return Promise.reject(error);
  }
);

// Define a type for the cache
interface CacheType<T> {
  [key: string]: T;
}

// Simple in-memory cache
const cache: CacheType<any> = {};

interface FetchOptions {
  url: string;
  method: Method;
  body?: any;
  params?: any;
  shouldToastError?: boolean;
  shouldToastSuccess?: boolean;
  revalidateEndpoint?: string;
  useCache?: boolean; // New option to control caching
}

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: any;
  fetchData: (overrideOptions?: Partial<FetchOptions>) => Promise<any>;
}

const useFetch = <T>(options: FetchOptions): FetchState<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const fetchData = useCallback(
    async (overrideOptions?: Partial<FetchOptions>): Promise<any> => {
      setLoading(true);
      setError(null);

      const finalOptions = {
        ...options,
        ...overrideOptions,
        shouldToastError:
          overrideOptions?.shouldToastError ??
          options.shouldToastError ??
          false,
      };
      const cacheKey = JSON.stringify({
        url: finalOptions.url,
        params: finalOptions.params,
      });

      // Check cache if useCache is true
      if (finalOptions.useCache && cache[cacheKey]) {
        setData(cache[cacheKey]);
        setLoading(false);
        return cache[cacheKey];
      }

      const config: AxiosRequestConfig = {
        method: finalOptions.method,
        url: finalOptions.url,
        data: finalOptions.body,
        params: finalOptions.params,
        headers: {
          Authorization: `Bearer ${readData("saitama-token")}`,
        },
      };
      // console.log(`Hitting endpoint: ${finalOptions.url}`);
      try {
        const response = await axios(config);
        // console.log(response);
        setData(response.data);

        // Update cache if useCache is true
        if (finalOptions.useCache) {
          cache[cacheKey] = response.data;
        }

        if (
          response.data.message &&
          finalOptions.shouldToastSuccess !== false
        ) {
          toast.success(response.data.message);
        }

        if (finalOptions.revalidateEndpoint) {
          await axios.get(finalOptions.revalidateEndpoint, {
            headers: {
              Authorization: `Bearer ${readData("saitama-token")}`,
            },
          });
        }
        return response.data;
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const errorMessage = err.response?.data?.message || err.message;
          setError(errorMessage);
          if (
            err.response?.status === 401 &&
            window.location.pathname !== "/"
          ) {
            clearData("saitama-token");
            clearData("saitamaRefresh-token");
            setCookie("saitama-token", false);
            if (!hasShownToast) {
              toast.error("Session expired, please log out and log in again");
              hasShownToast = true;
            }
          }
          if (finalOptions.shouldToastError) {
            toast.error(errorMessage);
          }
        } else {
          const unexpectedError = "An unexpected error occurred";
          setError(unexpectedError);
          if (finalOptions.shouldToastError) {
            toast.error(unexpectedError);
          }
        }
        return null;
      } finally {
        setLoading(false);
      }
    },
    [options]
  );

  useEffect(() => {
    createData("saitamaRefresh-token", readData("saitamaRefresh-token"));
  }, []);

  return { data, loading, error, fetchData };
};

export default useFetch;
