import React from 'react';
import styled from 'styled-components';
import { ProfilePhoto } from '../../../components/ProfilePhoto';

export const SportTermPlayer: React.FC<{
  username: string;
  profilePhotoSrc: string | null;
}> = ({ username, profilePhotoSrc }) => {
  return (
    <Wrapper className="d-flex">
      <ProfilePhoto src={profilePhotoSrc} style={{ width: '3rem', height: '3rem' }} />
      <p className="bold">{username}</p>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  gap: 0.8rem;
  padding: 1rem 0;
  font-size: 1.1rem;

  .icon {
    display: inline-block;
    background-color: var(--gray);
    padding: 1rem;
    border-radius: 50%;
  }
`;
