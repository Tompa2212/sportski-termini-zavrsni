import React from 'react';
import { useRecommendedSportTerms } from '../hooks/useRecommendedSportTerms';

export const HomePage: React.FC = () => {
  const { data: sportTerms, loading } = useRecommendedSportTerms();

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return <div>{JSON.stringify(sportTerms)}</div>;
};
