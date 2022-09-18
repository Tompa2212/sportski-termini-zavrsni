import React from 'react';
import { useSportTermTeams } from '../../../hooks/useSportTermTeams';
import { SportTermTeam } from './SportTermTeam';

interface SportTermTeamsProps {
  sportTermId: string | undefined;
}

export const SportTermTeams: React.FC<SportTermTeamsProps> = ({ sportTermId }) => {
  const { teams, addPlayer, removePlayer } = useSportTermTeams(sportTermId);

  const [teamA, teamB] = Object.values(teams);

  return (
    <div className="d-flex justify-content-between">
      <SportTermTeam team={teamA} addPlayer={addPlayer} removePlayer={removePlayer} />
      <SportTermTeam team={teamB} addPlayer={addPlayer} removePlayer={removePlayer} />
    </div>
  );
};
