import { useCallback, useEffect, useState } from 'react';
import { UserProfile } from '../models/user';
import { useApi } from '../providers/apiProvider';
import { appRequestLinks } from '../utils/appLinks';

const userHref = appRequestLinks.user;

interface ResponseData {
  user: UserProfile;
}

export const useUserProfileInfo = (username: string | undefined) => {
  const makeRequest = useApi();

  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [status, setStatus] = useState('pending');
  const [refresh, setRefresh] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setStatus('loading');
        const response = await makeRequest<ResponseData>({
          href: `${userHref}${username}`,
          type: 'GET',
        });

        if (response) {
          setUserData(response?.user);
          setStatus('success');
        }
      } catch (error) {
        setStatus('error');
        setUserData(null);
      }
    };

    if (username) {
      fetchData();
    }
  }, [makeRequest, username, refresh]);

  const triggerRefresh = useCallback(() => {
    setRefresh((dummy) => ({ ...dummy }));
  }, []);

  return {
    data: userData,
    triggerRefresh,
    status,
  };
};
