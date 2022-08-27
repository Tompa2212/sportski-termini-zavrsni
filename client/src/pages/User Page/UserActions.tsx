import React from 'react';
import { useParams } from 'react-router-dom';
import { ReactComponent as SettingsIcon } from '../../assets/icons/settings.svg';
import { useUser } from '../../providers/authProvider';
import { useFriendRequests } from '../../providers/socialProvider';

interface Props {
  isLoggedUserProfile: boolean;
  isFriendWithViewer: boolean;
  hasFriendRequestFromViewer: boolean;
  sentFriendRequestToViewer: boolean;
  onSuccess: () => void;
}

export const UserActions: React.FC<Props> = ({
  isLoggedUserProfile,
  isFriendWithViewer,
  hasFriendRequestFromViewer,
  sentFriendRequestToViewer,
  onSuccess: refreshUserInfo,
}) => {
  const { sendFriendRequest, deleteFriendRequest, acceptFriendRequest } =
    useFriendRequests();

  const viewer = useUser();
  const { username: visitedProfile } = useParams();

  const getButtonContent = () => {
    if (isLoggedUserProfile) {
      return 'Uredi profil';
    }

    if (isFriendWithViewer) {
      return 'Ukloni';
    }

    if (hasFriendRequestFromViewer) {
      return 'Poništi zahtjev za prijateljstvo';
    }

    if (sentFriendRequestToViewer) {
      return 'Prihvati zahtjev za prijateljstvo';
    }

    return 'Pošalji zahtjev za prijateljstvo';
  };

  const onClick = async () => {
    if (isLoggedUserProfile) {
      return;
    }

    if (viewer?.username && visitedProfile) {
      if (hasFriendRequestFromViewer) {
        await deleteFriendRequest({
          sender: viewer.username,
          receiver: visitedProfile,
          onComplete: refreshUserInfo,
        });

        return;
      }

      if (sentFriendRequestToViewer) {
        await acceptFriendRequest({
          fromUser: visitedProfile,
          onComplete: refreshUserInfo,
        });
        return;
      }

      if (isFriendWithViewer) {
        return;
      }

      await sendFriendRequest({
        toUser: visitedProfile,
        onComplete: refreshUserInfo,
      });
    }
  };

  const onDelete = async () => {
    if (viewer?.username && visitedProfile) {
      await deleteFriendRequest({
        sender: visitedProfile,
        receiver: viewer?.username,
        onComplete: refreshUserInfo,
      });
    }
  };

  return (
    <>
      <div className="d-flex gap--s">
        <button className="btn" onClick={onClick}>
          {getButtonContent()}
        </button>
        {sentFriendRequestToViewer ? (
          <button className="btn btn--white" onClick={onDelete}>
            Ukloni zahtjev
          </button>
        ) : null}
      </div>
      {isLoggedUserProfile ? (
        <SettingsIcon style={{ transform: 'scale(0.7)', cursor: 'pointer' }} />
      ) : null}
    </>
  );
};
