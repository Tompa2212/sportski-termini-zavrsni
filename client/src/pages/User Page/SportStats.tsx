import React from 'react';
import styled from 'styled-components';
import { useUserSportStats } from '../../hooks/useUserSportStats';

import { SportChart } from './SportChart';

export const SportStats: React.FC = () => {
  const { sportStats } = useUserSportStats();

  if (sportStats === null) {
    return <h2>Trenutno nema podataka o statistici korisnika</h2>;
  }

  return (
    <Wrapper>
      <header className="stats-total">
        <div>
          <h4>Mečeva</h4>
          <hr />
          <p>{sportStats.played}</p>
        </div>
        <div>
          <h4>Pobjeda</h4>
          <hr />
          <p className="clr--green">{sportStats.won}</p>
        </div>
        <div>
          <h4>Poraza</h4>
          <hr />
          <p className="clr--red">{sportStats.lost}</p>
        </div>
      </header>

      <section>
        <div
          style={{
            textAlign: 'center',
            marginBottom: '2rem',
            textTransform: 'uppercase',
          }}
        >
          <h3>Statistika igrača po sportovima</h3>
        </div>
        <div className="stats-per-sport">
          {sportStats.perSport.map((sport) => (
            <>
              <SportChart {...sport} />
            </>
          ))}
        </div>
      </section>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  margin-bottom: 3rem;

  .stats-total {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;

    text-align: center;
    margin-bottom: 3rem;

    & > div {
      h4 {
        text-transform: uppercase;
      }

      p {
        font-size: 1.6rem;
        font-weight: 700;
      }
    }
  }

  .stats-per-sport {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));
    gap: 4rem;

    & > div {
      justify-self: center;
    }
  }
`;
