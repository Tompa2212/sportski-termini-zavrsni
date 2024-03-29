import React from 'react';
import { Link } from 'react-router-dom';
import { useRecommendedSportTerms } from '../hooks/useRecommendedSportTerms';

import { SportTermIListItem } from './SportTerms/components/SportTermListItem';

export const HomePage: React.FC = () => {
  const { data: sportTerms, loading } = useRecommendedSportTerms();

  if (loading) {
    return <h1>Učitavanje...</h1>;
  }

  if (!loading && sportTerms && sportTerms.length === 0) {
    return (
      <>
        <h2>Trenutno nemamo preporučenih sportskih termina za Vas.</h2>
        <p>
          Istražite sportske termine po Vašoj želji <Link to="/istrazi">ovdje</Link>.
        </p>
      </>
    );
  }

  return (
    <section className="sport-term-grid">
      {sportTerms?.map((sportTerm) => {
        return <SportTermIListItem sportTerm={sportTerm} key={sportTerm.id} />;
      })}
    </section>
  );
};
