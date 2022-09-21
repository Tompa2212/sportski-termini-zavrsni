import React from 'react';
import styled from 'styled-components';

interface ProfilePhotoProps {
  style?: React.CSSProperties;
  src?: string | null;
}

export const ProfilePhoto: React.FC<ProfilePhotoProps> = ({ style, src }) => {
  return <Wrapper style={style}>{src ? <img src={src} alt="" /> : null}</Wrapper>;
};

const Wrapper = styled.figure`
  overflow: hidden;
  border-radius: 50%;
  width: 10rem;
  height: 10rem;

  background-color: gray;

  img {
    width: 100%;
    object-fit: cover;
  }
`;
