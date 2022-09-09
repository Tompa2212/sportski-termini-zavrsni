import { Modal } from '../../components/Modal';
import footballImg from '../../assets/sport-images/football.jpg';
import basketballImg from '../../assets/sport-images/basketball.jpg';
import tennisImg from '../../assets/sport-images/tennis.jpg';
import chessImg from '../../assets/sport-images/chess.jpg';
import badmintonImg from '../../assets/sport-images/badminton.jpg';
import tableTennisImg from '../../assets/sport-images/table-tennis.jpg';
import padelImg from '../../assets/sport-images/padel.jpg';
import { SportItem } from './SportItem';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useApi } from '../../providers/apiProvider';
import { appRequestLinks } from '../../utils/appLinks';
import { useNavigate } from 'react-router-dom';

const initializeHref = appRequestLinks.users;

const sports = [
  { sport: 'Nogomet', label: 'Nogomet', backgroundImage: footballImg },
  { sport: 'Košarka', label: 'Košarka', backgroundImage: basketballImg },
  { sport: 'Tenis', label: 'Tenis', backgroundImage: tennisImg },
  { sport: 'Šah', label: 'Šah', backgroundImage: chessImg },
  { sport: 'Stolni tenis', label: 'Stolni tenis', backgroundImage: tableTennisImg },
  { sport: 'Badminton', label: 'Badminton', backgroundImage: badmintonImg },
  { sport: 'Padel', label: 'Padel', backgroundImage: padelImg },
];

export const InitalizeUserModal = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(true);
  const [favoriteSports, setFavoriteSports] = useState(new Set());

  const makeRequest = useApi();

  const onClick = (sport: string) => {
    setFavoriteSports((prev) => {
      const newSports = new Set([...prev]);

      if (newSports.has(sport)) {
        newSports.delete(sport);
      } else {
        newSports.add(sport);
      }

      return newSports;
    });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await makeRequest(
        { href: `${initializeHref}initialize`, type: 'POST' },
        { body: { favoriteSports: Array.from(favoriteSports) } }
      );
    } catch (error: any) {
      alert(error.message);
    } finally {
      navigate('/');
    }
  };

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      style={{ maxWidth: '60rem', width: '90vw' }}
      heading="Inicjalizacija korisničkog računa"
    >
      <Wrapper onSubmit={onSubmit}>
        <div>
          <h3>Najdraži sportovi</h3>
          <div className="sport-grid">
            {sports.map((sport) => {
              return (
                <SportItem
                  {...sport}
                  onClick={() => onClick(sport.sport)}
                  isSelected={favoriteSports.has(sport.sport)}
                  key={sport.sport}
                />
              );
            })}
          </div>
        </div>
        <hr style={{ margin: '2rem 0' }} />
        <button type="submit" className="btn">
          Pohrani
        </button>
      </Wrapper>
    </Modal>
  );
};

const Wrapper = styled.form`
  h3 {
    margin-bottom: 1rem;
  }

  .sport-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
    gap: 1.5rem;
  }
`;
