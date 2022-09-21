export interface BaseUser {
  id: string;
  username: string;
  profilePhotoSrc: string | null;
}

export interface UserProfile {
  numOfFriends: number;
  username: string;
  profilePhotoSrc: string | null;
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
