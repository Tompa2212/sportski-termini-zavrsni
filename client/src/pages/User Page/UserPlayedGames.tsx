import { useParams } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { SportTerm } from '../../models/SportTerm';
import { appRequestLinks } from '../../utils/appLinks';
import { SportTermIListItem } from '../SportTerms/components/SportTermListItem';

interface ResponseData {
  numOfItems: number;
  sportTerms: SportTerm[];
}

const createUserPlayedGamesLink = (username: string | undefined) =>
  `${appRequestLinks.users}${username}/games`;

export const UserPlayedGames = () => {
  const { username } = useParams();
  const { data, status } = useFetch<ResponseData>(
    createUserPlayedGamesLink(username)
  );

  if (status === 'pending') {
    return <h1>Učitavanje...</h1>;
  }

  if (status === 'error') {
    return <h1>Pograška prilikom učitavanja...</h1>;
  }

  return (
    <section className="sport-term-grid">
      {data?.sportTerms.map((sportTerm) => (
        <SportTermIListItem key={sportTerm.id} sportTerm={sportTerm} />
      ))}
    </section>
  );
};
