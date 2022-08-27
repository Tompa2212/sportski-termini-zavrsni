export interface BaseUser {
  id: string;
  username: string;
}

export interface UserProfile {
  numOfFriends: number;
  username: string;
  isFriendWithViewer: boolean;
  hasFriendRequestFromViewer: boolean;
  sentFriendRequestToViewer: boolean;
}

export interface UserSportStats {
  lost: number;
  won: number;
  played: number;
  perSport: [
    {
      lost: number;
      won: number;
      name: string;
      played: number;
    }
  ];
}
