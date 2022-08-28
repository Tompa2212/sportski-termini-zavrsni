import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Modal } from '../../components/Modal';
import { FriendsData, useUserFriends } from '../../hooks/useUserFriends';
import { Link } from 'react-router-dom';
import { useUser } from '../../providers/authProvider';
import { useFriendRequests } from '../../providers/socialProvider';
interface FriendsModalProps {
  show: boolean;
  onHide: () => void;
}

export const FriendsModal: React.FC<FriendsModalProps> = ({ show, onHide }) => {
  const { username: visitedProfile } = useParams();
  const { friends, removeFriend, triggerRefresh } = useUserFriends(visitedProfile);
  const { sendFriendRequest } = useFriendRequests();
  const user = useUser();

  const onClick = async (friend: FriendsData) => {
    if (friend.friendWithViewer || user?.username === friend.username) {
      await removeFriend(visitedProfile);
    } else {
      await sendFriendRequest({
        toUser: friend.username,
        onComplete: triggerRefresh,
      });
    }
  };

  return (
    <>
      <Modal
        show={show}
        heading="Prijatelji"
        onHide={onHide}
        style={{ maxHeight: '15rem' }}
      >
        {friends.map((friend) => (
          <FriendItem
            key={friend.id}
            to={`/korisnik/${friend.username}`}
            onClick={onHide}
          >
            <div>{friend.username}</div>
            <button onClick={() => onClick(friend)} className="btn btn--white">
              {friend.friendWithViewer || user?.username === friend.username
                ? 'Ukloni'
                : 'Pošalji zahtjev'}
            </button>
          </FriendItem>
        ))}
      </Modal>
    </>
  );
};

const FriendItem = styled(Link)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  color: var(--text-color);
  text-decoration: none;

  button {
    padding: 0.2rem 0.5rem;
    border-radius: 0.3rem;
    border: 1px solid var(--gray-light);
  }
`;
