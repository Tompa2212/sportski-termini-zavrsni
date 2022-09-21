import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { SportTerm } from '../../../models/SportTerm';
import { toLocalDateString, toLocaleTimeString } from '../../../utils/dateTime';

interface SportTermListItemProps {
  sportTerm: SportTerm;
}

export const SportTermIListItem: React.FC<SportTermListItemProps> = ({
  sportTerm,
}) => {
  const isFilled = sportTerm.numOfPlayers === sportTerm.playersPerTeam * 2;

  return (
    <Wrapper open={!sportTerm.played} isFilled={isFilled}>
      <div className="heading">
        <div className="d-flex justify-content-between">
          <h3>{sportTerm.sport}</h3>
          <span className="status">{sportTerm.played ? 'ZATVOREN' : 'OTVOREN'}</span>
        </div>
        <div className="d-flex justify-content-between">
          <span>
            {sportTerm.city}, {sportTerm.address}
          </span>
          <span className="status__players">
            {sportTerm.numOfPlayers} / {sportTerm.playersPerTeam * 2 || 2}
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
          <span className="bold">Početak igranja</span>
          <span>{toLocaleTimeString(sportTerm.playTimeStart)}</span>
        </div>
        <div className="d-flex">
          <span className="bold">Kraj igranja</span>
          <span>{toLocaleTimeString(sportTerm.playTimeEnd)}</span>
        </div>
        <div className="d-flex">
          <span className="bold">Cijena po osobi</span>
          <span>{sportTerm.pricePerPerson} kn</span>
        </div>
      </div>
      <Link
        to={`/sportskiTermin/${sportTerm.id}`}
        className="btn w-100"
        style={{
          display: 'inline-block',
          textDecoration: 'none',
          textAlign: 'center',
        }}
      >
        Detalji
      </Link>
    </Wrapper>
  );
};

const Wrapper = styled.article<{ open: boolean; isFilled: boolean }>`
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
        color: ${(props) => (props.isFilled ? 'var(--red)' : 'var(--green)')};
      }
    }
  }

  .info {
    margin-bottom: 1.8rem;

    > div {
      justify-content: space-between;
    }

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
