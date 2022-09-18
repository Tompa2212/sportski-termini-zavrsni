import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { useSportTermData } from '../../hooks/useSportTermData';
import { BaseUser } from '../../models/user';
import { toLocalDateString, toLocaleTimeString } from '../../utils/dateTime';
import { SportTermTeams } from './SportTermTeams/SportTermTeams';

const getNumberOfPlayers = (
  teams:
    | {
        players: BaseUser[];
      }[]
    | undefined
) => {
  if (!teams) {
    return 0;
  }

  return teams.reduce((total, currentTeam) => {
    return total + currentTeam.players.length;
  }, 0);
};

export const SportTerm = () => {
  const { id: sportTermId } = useParams();
  const [sportTerm, status] = useSportTermData(sportTermId);

  const numOfPlayers = useMemo(
    () => getNumberOfPlayers(sportTerm?.teams),
    [sportTerm?.teams]
  );

  if (status === 'loading') {
    return <h1>Učitavanje...</h1>;
  }

  if (status === 'error') {
    <h1>Trenutno ne možemo pronaći traženi sportski termin.</h1>;
  }

  if (!sportTerm) {
    return <h1>Učitavanje...</h1>;
  }

  const { played, playersPerTeam } = sportTerm;

  return (
    <section>
      <Wrapper open={!played} isFilled={numOfPlayers === playersPerTeam * 2}>
        <header>
          <div className="d-flex justify-content-between">
            <h3>{sportTerm.sport}</h3>
            <span className="status bold">{played ? 'ZATVOREN' : 'OTVOREN'}</span>
          </div>
          <div className="d-flex justify-content-between">
            <span className="bold">
              {sportTerm.city}, {sportTerm.address}
            </span>
            <span className="status__players">
              {numOfPlayers} / {playersPerTeam * 2 || 2}
            </span>
          </div>
        </header>
        <hr />
        <main>
          <div className="info">
            <h3 className="group-header">Osnovni podaci</h3>
            <div className="d-flex justify-content-between">
              <span className="bold">Datum igranja</span>
              <span>{toLocalDateString(sportTerm.playDate)}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="bold">Početak igranja</span>
              <span>{toLocaleTimeString(sportTerm.playTimeStart)}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="bold">Kraj igranja</span>
              <span>{toLocaleTimeString(sportTerm.playTimeEnd)}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="bold">Cijena po osobi</span>
              <span>{sportTerm.pricePerPerson} kn</span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="bold">Organizirao</span>
              <span>{sportTerm.createdBy}</span>
            </div>
          </div>
        </main>
        <hr />
        <div>
          <h3 className="group-header">Dodatni podaci</h3>
          <div
            className="d-flex justify-content-between"
            style={{ fontSize: '1.1rem' }}
          >
            <span className="bold">Komentar organizatora: </span>
            <span>{sportTerm.comment}</span>
          </div>
        </div>
        <hr />
        <div>
          <h3 className="group-header">Timovi</h3>
          <SportTermTeams sportTermId={sportTermId} />
        </div>
      </Wrapper>
    </section>
  );
};

const Wrapper = styled.article<{ open: boolean; isFilled: boolean }>`
  border: var(--border);
  border-radius: var(--radius);
  overflow: hidden;

  & > *:not(hr) {
    padding: 0.6rem 1rem;
  }

  .group-header {
    font-size: 1.4rem;
    margin-bottom: 1.2rem;
  }

  header {
    h3 {
      font-size: 1.4rem;
    }

    .status {
      color: ${(props) => (props.open ? 'var(--green)' : 'var(--red)')};

      &__players {
        font-weight: 700;
        color: ${(props) => (props.isFilled ? 'var(--red)' : 'var(--green)')};
      }
    }
  }

  main {
    .info {
      & > div {
        margin-bottom: 1rem;

        span {
          font-size: 1.1rem;
        }
      }

      & > div:not(:last-child) {
        padding-bottom: 0.7rem;
        margin-bottom: 0.7rem;
        border-bottom: 1px solid var(--gray-light);
      }
    }
  }
`;
