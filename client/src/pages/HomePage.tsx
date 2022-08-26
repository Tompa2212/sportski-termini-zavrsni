import React from 'react';
import { useRecommendedSportTerms } from '../hooks/useRecommendedSportTerms';
import { SportTermItem } from './SportTerms/components/SportTermItem';

export const HomePage: React.FC = () => {
  const { data: sportTerms, loading } = useRecommendedSportTerms();

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <section className="sport-term-grid">
      {sportTerms.map((sportTerm) => {
        return (
          <>
            <SportTermItem sportTerm={sportTerm} key={sportTerm.id} />
            <SportTermItem sportTerm={sportTerm} key={sportTerm.id} />
            <SportTermItem sportTerm={sportTerm} key={sportTerm.id} />
            <SportTermItem sportTerm={sportTerm} key={sportTerm.id} />
          </>
        );
      })}
    </section>
  );
};
