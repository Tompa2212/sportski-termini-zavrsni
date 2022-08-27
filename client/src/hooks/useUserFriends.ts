import { useCallback, useEffect, useState } from 'react';
import { BaseUser } from '../models/user';
import { useApi } from '../providers/apiProvider';
import { appRequestLinks } from '../utils/appLinks';

interface Response {
  friends: BaseUser[];
}

const friendsHref = appRequestLinks.friends;

export const useUserFriends = (userId: string) => {
  const [friends, setFriends] = useState<BaseUser[]>([]);
  const makeRequest = useApi();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await makeRequest<Response>({
          href: `${friendsHref}${userId}`,
          type: 'GET',
        });

        if (response) {
          setFriends(response.friends);
        }
      } catch (error) {
        setFriends([]);
        alert(error);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [makeRequest, userId]);

  const removeFriend = useCallback(
    async (userId: string) => {
      const response = await makeRequest({
        href: `${friendsHref}${userId}`,
        type: 'DELETE',
      });

      if (response) {
        return true;
      }

      return false;
    },

    [makeRequest]
  );

  return {
    friends,
    removeFriend,
  };
};
