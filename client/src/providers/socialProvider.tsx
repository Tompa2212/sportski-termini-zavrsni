import React, { useState, useEffect, useCallback } from 'react';
import { FriendRequest } from '../models/FriendRequest';
import { appRequestLinks } from '../utils/appLinks';
import { useApi } from './apiProvider';

const friendRequestHref = appRequestLinks.friendRequests;
const friendsHref = appRequestLinks.friends;

interface SocialProviderProps {
  friendRequests: FriendRequest[];
  sendFriendRequest: (toUserId: string) => Promise<void>;
  deleteFriendRequest: (frId: string) => Promise<void>;
  acceptFriendRequest: (frId: string) => Promise<void>;
}

interface ResponseData {
  friendRequests: FriendRequest[];
}

const SocialContext = React.createContext<SocialProviderProps | undefined>(undefined);

export const SocialProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const makeRequest = useApi();

  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);

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
  }, [makeRequest]);

  const sendFriendRequest = useCallback(
    async (toUserId: string) => {
      const resp = await makeRequest(
        { href: friendRequestHref, type: 'POST' },
        { body: { toUserId } }
      );

      if (resp === null) {
        alert('Sending request failed');
      }
    },
    [makeRequest]
  );

  const deleteFriendRequest = useCallback(
    async (frId: string) => {
      const resp = await makeRequest(
        { href: friendRequestHref, type: 'DELETE' },
        { params: { frId } }
      );

      if (resp === null) {
        alert('Deleting request failed');
      }
    },
    [makeRequest]
  );

  const acceptFriendRequest = useCallback(
    async (frId: string) => {
      const resp = await makeRequest(
        { href: friendsHref, type: 'POST' },
        { params: { frId } }
      );

      if (resp === null) {
        alert('Accepting request failed.');
      }
    },
    [makeRequest]
  );

  return (
    <SocialContext.Provider
      value={{
        friendRequests,
        sendFriendRequest,
        deleteFriendRequest,
        acceptFriendRequest,
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
