import { BaseUser } from './user';

export interface SportTerm {
  country: string;
  score: number;
  address: string;
  city: string;
  createdBy: string;
  playDate: string;
  pricePerPerson: number;
  playTimeStart: string;
  playTimeEnd: string;
  teamGame: boolean;
  comment: string;
  id: string;
  played: boolean;
  sport: string;
  playersPerTeam: number;
  numOfPlayers: number;
}

export type SportTermWithTeams = SportTerm & {
  teams: {
    players: BaseUser[];
    name: string;
    id: string;
    gameResult: string;
  }[];
};

export interface Team {
  name: string;
  id: string;
  gameResult: string;
  players: BaseUser[];
}
