import axios, { AxiosInstance } from 'axios';
import React, { useCallback, useLayoutEffect, useRef } from 'react';
import { Link } from '../models/Link';
import { uniqueId } from 'lodash';
import { useAuth } from './authProvider';

interface MakeRequestOptions {
  body?: any;
  params?: any;
}

type MakeRequestFn = <T>({
  link,
  options,
  abortController,
}: {
  link: Link;
  options?: MakeRequestOptions;
  abortController: AbortController;
}) => Promise<T>;

const apiContext = React.createContext<MakeRequestFn>(undefined as any);

const defaultOptions: MakeRequestOptions = {};

interface ApiProviderProps {
  getBearerToken: () => string | null | undefined;
}

export const ApiProvider: React.FC<
  ApiProviderProps & { children: React.ReactNode }
> = ({ getBearerToken, children }) => {
  const getBearerTokenRef = useRef<() => string | null | undefined>(() => undefined);
  const { signout } = useAuth();

  const createFetcher = (): AxiosInstance => {
    const fetcher = axios.create({
      baseURL: 'http://localhost:3000/api/v1/',
    });

    fetcher.interceptors.request.use((config) => {
      const headers = {
        ...(getBearerTokenRef.current()
          ? {
              Authorization: `Bearer ${getBearerTokenRef.current()}`,
            }
          : {}),
      };

      return {
        ...config,
        headers,
      };
    });

    fetcher.interceptors.response.use(
      function (response) {
        return response;
      },
      (error) => {
        if (error.response && error.response.status === 401) {
          signout();
        }
        return Promise.reject(error);
      }
    );

    return fetcher;
  };

  const fetcherRef = useRef<AxiosInstance>(createFetcher());

  useLayoutEffect(() => {
    getBearerTokenRef.current = getBearerToken;
  });

  const makeRequest: MakeRequestFn = useCallback(
    async ({ link, options = defaultOptions, abortController }) => {
      if (!fetcherRef.current) {
        throw new Error('API is not initialized');
      }

      const { body, params } = options;

      try {
        const response = await fetcherRef.current.request({
          url: link.href,
          method: link.type,
          data: body,
          params,
          signal: abortController.signal,
        });

        return response.data;
      } catch (error) {
        throw error;
      }
    },
    []
  );

  return <apiContext.Provider value={makeRequest}>{children}</apiContext.Provider>;
};

type MakeRequest = <T extends {}>(
  link: Link,
  options?: MakeRequestOptions
) => Promise<T | null>;

export const useApi = (): MakeRequest => {
  const abortControllers = useRef<Record<string, AbortController>>({});

  const makeRequest = React.useContext(apiContext);

  const makeRequestWrapper = useCallback(
    async <T extends {}>(
      link: Link,
      options: MakeRequestOptions = defaultOptions
    ) => {
      const id = uniqueId('make-request-id');

      Object.values(abortControllers.current).forEach((abortController) =>
        abortController.abort()
      );

      abortControllers.current = {
        [id]: new AbortController(),
      };

      try {
        const result = await makeRequest<T>({
          link,
          options,
          abortController: abortControllers.current[id],
        });

        return result;
      } catch (error: any) {
        if (error.code !== 'ERR_CANCELED') {
          throw error;
        } else {
          return null;
        }
      }
    },
    [makeRequest]
  );

  return makeRequestWrapper;
};
