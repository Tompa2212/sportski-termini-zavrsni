import { Link } from 'react-router-dom';
import { SettingsDropdown } from './SettingsDropdown';
import { ReactComponent as HomeIcon } from '../../assets/icons/home.svg';
import { ReactComponent as CreateSportTermIcon } from '../../assets/icons/createTerm.svg';
import { ReactComponent as SportTermsIcon } from '../../assets/icons/soccer.svg';
import { useState } from 'react';
import { UserSearch } from './SearchField/UserSearch';
import { Notifications } from './Notifications/Notifications';

const links = [
  {
    id: 1,
    to: '/',
    content: <HomeIcon className="nav__icon" />,
  },
  {
    id: 3,
    to: '/explore',
    content: <SportTermsIcon className="nav__icon" />,
  },

  {
    id: 4,
    to: '/create',
    content: <CreateSportTermIcon className="nav__icon" />,
  },
];

export const Navigation = () => {
  const [active, setActive] = useState(1);

  return (
    <header className="shadow">
      <nav className="nav">
        <UserSearch />
        <ul className="nav__center">
          {links.map((link) => {
            return (
              <li className="nav__item" key={link.id}>
                <Link
                  className={`nav__link ${active === link.id ? 'active' : ''}`}
                  to={link.to}
                  onClick={() => setActive(link.id)}
                >
                  {link.content}
                </Link>
              </li>
            );
          })}
        </ul>
        <ul className="user-nav">
          <Notifications />
          <SettingsDropdown />
        </ul>
      </nav>
    </header>
  );
};
