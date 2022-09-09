import React from 'react';
import styled from 'styled-components';

interface SportItemProps {
  backgroundImage: string;
  isSelected: boolean;
  sport: string;
  onClick: () => void;
}

export const SportItem: React.FC<SportItemProps> = ({
  sport,
  isSelected,
  backgroundImage,
  onClick,
}) => {
  return (
    <Wrapper onClick={onClick} className={`${isSelected ? 'selected' : null}`}>
      <h3>{sport}</h3>
      <img src={backgroundImage} alt={sport} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  cursor: pointer;
  display: grid;
  place-items: center;
  isolation: isolate;
  position: relative;

  border-radius: 1rem;
  overflow: hidden;

  color: var(--white);

  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
  }

  &:hover::after {
    background-color: rgba(0, 0, 0, 0.1);
  }

  &.selected {
    outline: 0.3rem solid var(--green);
  }

  & > * {
    grid-column: 1 / -1;
    grid-row: 1 / -1;
  }

  h3 {
    z-index: 1;
  }

  img {
    width: 100%;
    height: 9rem;
    object-fit: cover;
    z-index: -1;
  }
`;
