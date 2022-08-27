import React, { useState, useEffect, useCallback } from 'react';
import { useExecuteAction } from '../hooks/useExecuteAction';
import { FriendRequest } from '../models/FriendRequest';
import { appRequestLinks } from '../utils/appLinks';
import { useApi } from './apiProvider';

const friendRequestHref = appRequestLinks.friendRequests;
const friendsHref = appRequestLinks.friends;

interface DeleteFriendRequestParams {
  sender: string;
  receiver: string;
  onComplete?: () => void;
}

interface SendFriendRequestParams {
  toUser: string;
  onComplete?: () => void;
}

interface AcceptFriendRequestParams {
  fromUser: string;
  onComplete?: () => void;
}

interface SocialProviderProps {
  friendRequests: FriendRequest[];
  sendFriendRequest: (params: SendFriendRequestParams) => Promise<void>;
  deleteFriendRequest: (params: DeleteFriendRequestParams) => Promise<void>;
  acceptFriendRequest: (params: AcceptFriendRequestParams) => Promise<void>;
  triggerRefresh: () => void;
}

interface ResponseData {
  friendRequests: FriendRequest[];
}

const SocialContext = React.createContext<SocialProviderProps | undefined>(undefined);

export const SocialProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const makeRequest = useApi();
  const executeAction = useExecuteAction();

  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [refresh, setRefresh] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const response = await makeRequest<ResponseData>({
        href: friendRequestHref,
        type: 'GET',
      });

      if (response) {
        setFriendRequests(response.friendRequests);
      } else {
        setFriendRequests([]);
      }
    };

    fetchData();
  }, [makeRequest, refresh]);

  const triggerRefresh = useCallback(() => {
    setRefresh((dummyValue) => ({ ...dummyValue }));
  }, []);

  const sendFriendRequest = useCallback(
    async ({ toUser, onComplete }: SendFriendRequestParams) => {
      executeAction({
        link: { href: friendRequestHref, type: 'POST' },
        body: { toUser },
        onComplete: () => {
          triggerRefresh();
          onComplete && onComplete();
        },
      });
    },
    [executeAction, triggerRefresh]
  );

  const deleteFriendRequest = useCallback(
    async ({ sender, receiver, onComplete }: DeleteFriendRequestParams) => {
      executeAction({
        link: { href: `${friendRequestHref}/remove`, type: 'POST' },
        body: { sender, receiver },
        onComplete: () => {
          triggerRefresh();
          onComplete && onComplete();
        },
      });
    },
    [executeAction, triggerRefresh]
  );

  const acceptFriendRequest = useCallback(
    async ({ fromUser, onComplete }: AcceptFriendRequestParams) => {
      await executeAction({
        link: { href: friendsHref, type: 'POST' },
        body: { sender: fromUser },
        onComplete: () => {
          triggerRefresh();
          onComplete && onComplete();
        },
      });
    },
    [executeAction, triggerRefresh]
  );

  return (
    <SocialContext.Provider
      value={{
        friendRequests,
        sendFriendRequest,
        deleteFriendRequest,
        acceptFriendRequest,
        triggerRefresh,
      }}
    >
      {children}
    </SocialContext.Provider>
  );
};

export const useFriendRequests = () => {
  const context = React.useContext(SocialContext);

  if (context === undefined) {
    throw new Error(
      `FriendRequestsProvider needs to be provided to use useFriendRequestsHook`
    );
  }

  return context;
};
