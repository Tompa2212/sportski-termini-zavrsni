import { useCallback, useEffect, useState } from 'react';
import { BaseUser } from '../models/user';
import { useApi } from '../providers/apiProvider';
import { appRequestLinks } from '../utils/appLinks';
import { useExecuteAction } from './useExecuteAction';

export type FriendsData = BaseUser & { friendWithViewer: boolean };

interface Response {
  friends: FriendsData[];
}

const friendsHref = appRequestLinks.friends;

export const useUserFriends = (userId: string | undefined) => {
  const [friends, setFriends] = useState<FriendsData[]>([]);
  const [refresh, setRefresh] = useState({});
  const makeRequest = useApi();
  const executeAction = useExecuteAction();

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
  }, [makeRequest, userId, refresh]);

  const triggerRefresh = useCallback(() => {
    setRefresh((prev) => ({ ...prev }));
  }, []);

  const removeFriend = useCallback(
    async (username: string | undefined) => {
      await executeAction({
        link: {
          href: `${friendsHref}${username}`,
          type: 'DELETE',
        },
        onComplete: triggerRefresh,
      });
    },

    [executeAction, triggerRefresh]
  );

  return {
    friends,
    removeFriend,
    triggerRefresh,
  };
};
