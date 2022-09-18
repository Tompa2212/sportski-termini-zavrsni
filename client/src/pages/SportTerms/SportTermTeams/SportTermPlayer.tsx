import React from 'react';
import styled from 'styled-components';

export const SportTermPlayer: React.FC<{ username: string }> = ({ username }) => {
  return (
    <Wrapper className="d-flex">
      <span className="icon"></span>
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
