import { useEffect, useState } from 'react';
import { SportTermWithTeams } from '../models/SportTerm';
import { useApi } from '../providers/apiProvider';
import { appRequestLinks } from '../utils/appLinks';

const getSportTermLink = appRequestLinks.sportTerms;

type Response = {
  sportTerm: SportTermWithTeams;
};

export const useSportTermData = (
  sportTermId: string | undefined
): [SportTermWithTeams | undefined, string] => {
  const [status, setStatus] = useState('pending');
  const [data, setData] = useState<SportTermWithTeams | undefined>(undefined);

  const makeRequest = useApi();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await makeRequest<Response>({
          href: `${getSportTermLink}${sportTermId}`,
          type: 'GET',
        });

        setStatus('success');
        setData(resp?.sportTerm);
      } catch (error) {}
    };

    if (sportTermId) {
      fetchData();
    }
  }, [sportTermId, makeRequest]);

  return [data, status];
};
