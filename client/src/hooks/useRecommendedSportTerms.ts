import { useEffect, useState } from 'react';
import { SportTerm } from '../models/SportTerm';
import { useApi } from '../providers/apiProvider';
import { useUser } from '../providers/authProvider';
import { appRequestLinks } from '../utils/appLinks';

const getRecommendedSportTermsHref = appRequestLinks.recommendedSportTerms;

interface ResponseData {
  sportTerms: SportTerm[];
}

interface UseRecommendedSportTermsReturn {
  data: SportTerm[] | null;
  loading: boolean;
}

const initialState: UseRecommendedSportTermsReturn = {
  data: null,
  loading: false,
};

export const useRecommendedSportTerms = (): UseRecommendedSportTermsReturn => {
  const makeRequest = useApi();
  const user = useUser();

  const [data, setData] = useState(initialState);

  useEffect(() => {
    const fetchData = async () => {
      setData((prev) => ({ ...prev, loading: true }));
      const response = await makeRequest<ResponseData>({
        href: `${getRecommendedSportTermsHref}/${user?.id}`,
        type: 'GET',
      });

      if (response) {
        setData({ data: response.sportTerms, loading: false });
      } else {
        setData(initialState);
      }
    };

    if (user) {
      fetchData();
    }
  }, [makeRequest, user]);

  return data;
};
