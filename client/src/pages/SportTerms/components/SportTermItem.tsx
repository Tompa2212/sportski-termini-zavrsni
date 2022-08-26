import React from 'react';
import styled from 'styled-components';
import { SportTerm } from '../../../models/SportTerm';
import { toLocalDateString, toLocaleTimeString } from '../../../utils/dateTime';

interface SportTermItemProps {
  sportTerm: SportTerm;
}

export const SportTermItem: React.FC<SportTermItemProps> = ({ sportTerm }) => {
  return (
    <Wrapper open={sportTerm.played === false}>
      <div className="heading">
        <div className="d-flex">
          <h3>{sportTerm.sport}</h3>
          <span className="status">{sportTerm.played ? 'ZATVOREN' : 'OTVOREN'}</span>
        </div>
        <div className="d-flex">
          <span>
            {sportTerm.city}, {sportTerm.address}
          </span>
          <span className="status__players">
            {sportTerm.numOfPlayers} / {sportTerm.maxPlayers || 2}
          </span>
        </div>
      </div>
      <hr />
      <div className="info">
        <div className="d-flex">
          <span className="bold">Datum igranja</span>
          <span>{toLocalDateString(sportTerm.playDate)}</span>
        </div>
        <div className="d-flex">
          <span className="bold">Vrijeme igranja</span>
          <span>{toLocaleTimeString(sportTerm.playTime)}</span>
        </div>
        <div className="d-flex">
          <span className="bold">Cijena po osobi</span>
          <span>{sportTerm.pricePerPerson} kn</span>
        </div>
      </div>
      <button className="btn w-100">Detalji</button>
    </Wrapper>
  );
};

const Wrapper = styled.article<{ open: boolean }>`
  border: var(--border);
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: var(--box-shadow);

  .heading {
    margin-bottom: 1rem;

    h3 {
      font-size: 1.6rem;
    }

    .status {
      font-weight: 700;
      color: ${(props) => (props.open ? 'var(--green)' : 'var(--red)')};

      &__players {
        font-weight: 700;
        color: ${(props) => (props.open ? 'var(--green)' : 'var(--red)')};
      }
    }
  }

  .info {
    margin-bottom: 1.8rem;

    > div:not(:last-child) {
      padding-bottom: 0.7rem;
      margin-bottom: 0.7rem;
      border-bottom: 1px solid var(--gray-light);
    }
  }

  hr {
    background-color: var(--gray-dark);
    border-radius: 2px;
    margin-bottom: 1.5rem;
  }
`;
