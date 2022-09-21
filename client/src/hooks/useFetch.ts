import { useCallback, useEffect, useReducer, useState } from 'react';
import { useApi } from '../providers/apiProvider';

type Action<T> =
  | { type: 'request' }
  | {
      type: 'success';
      payload: T;
    }
  | { type: 'error' };

type State<T> = {
  status: 'pending' | 'success' | 'error';
  data?: T;
};

interface UseFetchReturnVal<T> extends State<T> {
  refetchData: () => void;
}

export const useFetch = <T = unknown>(link: string): UseFetchReturnVal<T> => {
  const initialState: State<T> = {
    status: 'pending',
    data: undefined,
  };

  const reducer = (state: State<T>, action: Action<T>): State<T> => {
    switch (action.type) {
      case 'request': {
        return { ...state, status: 'pending' };
      }

      case 'success': {
        return { ...state, data: action.payload, status: 'success' };
      }

      case 'error': {
        return { ...state, status: 'error' };
      }
      default: {
        return { ...state };
      }
    }
  };

  const [data, dispatch] = useReducer(reducer, initialState);
  const [refresh, triggerRefresh] = useState({});

  const makeRequest = useApi();

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'request' });

        const resp = (await makeRequest({ href: link, type: 'GET' })) as T;

        dispatch({ type: 'success', payload: resp });
      } catch (error) {
        dispatch({ type: 'error' });
      }
    };

    fetchData();
  }, [link, refresh, makeRequest]);

  const refetchData = useCallback(() => {
    triggerRefresh({});
  }, []);

  return {
    ...data,
    refetchData,
  };
};
