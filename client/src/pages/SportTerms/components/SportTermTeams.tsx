import React from 'react';
import styled from 'styled-components';
import { useSportTermTeams } from '../../../hooks/useSportTermTeams';
import { useUser } from '../../../providers/authProvider';

interface SportTermTeamsProps {
  sportTermId: string | undefined;
}

export const SportTermTeams: React.FC<SportTermTeamsProps> = ({ sportTermId }) => {
  const { teams, addPlayer, removePlayer } = useSportTermTeams(sportTermId);

  const [teamA, teamB] = Object.values(teams);
  const viewer = useUser();

  console.log(teamA, teamB);

  // const isAlreadyInTeam = (teamId: string) => {
  //   return !!data.find(
  //     (player) => player === viewer?.username
  //   );
  // };

  return (
    <Wrapper className="d-flex justify-content-between">
      <div className="team">
        <h3>{teamA?.name || 'Tim A'}</h3>
        <div>
          {teamA?.players.map((player) => {
            return <div style={{ padding: '0.7rem 0' }}>{player.username}</div>;
          })}
        </div>
        <button
          className="btn"
          onClick={() => addPlayer(teamA.id)}
          style={{ padding: '0.3rem', fontSize: '0.9rem' }}
        >
          Dodaj me u tim
        </button>
      </div>
      <div className="team">
        <h3>{teamB?.name || 'Tim B'}</h3>
        <div>
          {teamB?.players.map((player) => {
            return <div style={{ padding: '0.7rem 0' }}>{player.username}</div>;
          })}
        </div>
        <button
          className="btn"
          style={{ padding: '0.3rem', fontSize: '0.9rem' }}
          onClick={() => addPlayer(teamB?.id)}
        >
          Dodaj me u tim
        </button>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  .team {
    align-self: stretch;
    display: grid;
    grid-template-rows: min-content auto min-content;
  }
`;
