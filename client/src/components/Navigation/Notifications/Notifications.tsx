import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as NotificationIcon } from '../../../assets/icons/notification.svg';
import { useOnClickOutside } from '../../../hooks/useOnClickOutside';
import { useFriendRequests } from '../../../providers/socialProvider';

export const Notifications = () => {
  const { friendRequests } = useFriendRequests();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(dropdownRef, () => setOpen(false));

  if (!friendRequests) {
    return null;
  }

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <div
        onClick={() => setOpen((prev) => !prev)}
        style={{ display: 'flex', alignItems: 'center' }}
      >
        <NotificationIcon className="user-nav__icon" />
        {friendRequests.length > 0 ? (
          <span className="user-nav__notification">
            {friendRequests && friendRequests.length}
          </span>
        ) : null}
      </div>

      {open && (
        <div className="dropdown-container__dropdown">
          {friendRequests.map((item) => {
            return (
              <Link
                to={`/korisnik/${item.sender}`}
                className="dropdown-container__item"
                key={item.id}
              >
                <div className="d-flex" style={{ gap: '1rem' }}>
                  <span className="dropdown-container__icon"></span>
                  <p>
                    <span className="bold">{item.sender}</span> Vam šalje zahtjev za
                    prijateljstvom.
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
