import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Team } from '../../../models/SportTerm';
import { SportTermPlayer } from './SportTermPlayer';
import { ReactComponent as PlusIcon } from '../../../assets/icons/add.svg';
import { ReactComponent as DeleteIcon } from '../../../assets/icons/close.svg';
import { useUser } from '../../../providers/authProvider';

interface SportTermTeamProps {
  team: Team;
  addPlayer: (teamId: string) => void;
  removePlayer: (teamId: string, username: string | undefined) => void;
}

export const SportTermTeam: React.FC<SportTermTeamProps> = ({
  team,
  addPlayer,
  removePlayer,
}) => {
  const user = useUser();

  const isUserInTeam = useMemo(() => {
    return !!team?.players.find((player) => player.id === user?.id);
  }, [team, user]);

  const onClick = () => {
    if (isUserInTeam) {
      removePlayer(team.id, user?.username);
    } else {
      addPlayer(team.id);
    }
  };

  return (
    <Wrapper>
      <h3>{team?.name || 'Tim A'}</h3>
      <div>
        {team?.players.map((player) => {
          return <SportTermPlayer key={player.id} username={player.username} />;
        })}
      </div>
      <button
        className={`btn bold ${isUserInTeam ? 'btn--red' : ''}`}
        onClick={onClick}
      >
        {isUserInTeam ? (
          <>
            Ukloni <DeleteIcon />
          </>
        ) : (
          <>
            Dodaj <PlusIcon />
          </>
        )}
      </button>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  align-self: stretch;
  display: grid;
  grid-template-rows: min-content auto min-content;
  grid-row-gap: 0.5rem;

  button {
    justify-self: start;
    padding: 0.3rem 0.5rem;

    display: inline-flex;
    align-items: center;
    gap: 0.4rem;

    svg {
      fill: currentColor;
    }
  }
`;
