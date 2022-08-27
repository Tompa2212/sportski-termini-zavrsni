import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserSportStats } from '../models/user';
import { useApi } from '../providers/apiProvider';
import { appRequestLinks } from '../utils/appLinks';

const sportStatsHref = appRequestLinks.userSportStats;

export const useUserSportStats = () => {
  const { username: visitedUser } = useParams();
  const makeRequest = useApi();
  const [sportStats, setSportStats] = useState<UserSportStats | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await makeRequest<UserSportStats>({
        href: `${sportStatsHref}${visitedUser}`,
        type: 'GET',
      });

      if (response) {
        setSportStats(response);
      } else if (response === null) {
        setSportStats(null);
      }
    };

    if (visitedUser) {
      fetchData();
    }
  }, [visitedUser, makeRequest]);

  return {
    sportStats,
  };
};
