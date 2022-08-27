import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Modal } from '../../components/Modal';
import { useUserProfileInfo } from '../../hooks/useUserProfileInfo';
import { useUser } from '../../providers/authProvider';
import { FriendsModal } from './FriendsModal';
import { SportStats } from './SportStats';
import { UserActions } from './UserActions';

export const UserPage = () => {
  const user = useUser();

  const { username: paramUsername } = useParams();
  const {
    data: userProfileData,
    status,
    triggerRefresh,
  } = useUserProfileInfo(paramUsername);

  const isLoggedUserProfile = user?.username === userProfileData?.username;

  if (status === 'error') {
    return (
      <h2>
        Korisnik sa korisničkim imenom <span className="bold">{paramUsername}</span>{' '}
        ne postoji.
      </h2>
    );
  }

  if (status === 'pending') {
    <h2>Loading...</h2>;
  }

  if (!userProfileData) {
    return null;
  }

  const { username, numOfFriends, ...socialInfo } = userProfileData;

  return (
    <Wrapper>
      <main>
        <header>
          <span className="profile-icon"></span>
          <div>
            <div className="d-flex gap--s user-actions">
              <h3>{username}</h3>
              <UserActions
                {...socialInfo}
                isLoggedUserProfile={isLoggedUserProfile}
                onSuccess={triggerRefresh}
              />
            </div>
            <div>
              <FriendsModal numOfFriends={numOfFriends} />
            </div>
          </div>
        </header>
        <SportStats />
      </main>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  header {
    display: flex;
    gap: 5rem;

    margin-bottom: 4rem;

    & > div {
      align-self: flex-start;
    }

    .user-actions {
      margin-bottom: 1rem;
    }

    h3 {
      font-size: 2rem;
      font-weight: 400;
    }

    p,
    button.btn--outline {
      font-size: 1.1rem;
    }

    .profile-icon {
      display: inline-block;
      background-color: var(--gray);
      padding: 4rem;
      border-radius: 50%;
    }
  }
`;
