import { noop } from 'lodash';
import { useCallback } from 'react';
import { Link } from '../models/Link';
import { useApi } from '../providers/apiProvider';

interface ExecuteActionParams {
  link: Link;
  body?: any;
  params?: any;
  onComplete?: () => void;
}

export const useExecuteAction = () => {
  const makeRequest = useApi();

  return useCallback(
    async ({ link, body, params, onComplete = noop }: ExecuteActionParams) => {
      try {
        await makeRequest(link, { body, params });

        onComplete();
      } catch (error) {
        alert(error);
      }
    },
    [makeRequest]
  );
};
