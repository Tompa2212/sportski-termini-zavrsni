import { useRef, useState } from 'react';
import { ReactComponent as NotificationIcon } from '../../../assets/icons/notification.svg';
import { useOnClickOutside } from '../../../hooks/useOnClickOutside';
import { useFriendRequests } from '../../../providers/socialProvider';

export const Notifications = () => {
  const { friendRequests } = useFriendRequests();
  const [open, setOpen] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(dropdownRef, () => setOpen(false));

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <div
        onClick={() => setOpen((prev) => !prev)}
        style={{ display: 'flex', alignItems: 'center' }}
      >
        <NotificationIcon className="user-nav__icon" />
        {friendRequests.length && (
          <span className="user-nav__notification">{friendRequests.length}</span>
        )}
      </div>

      {open && (
        <div className="dropdown-container__dropdown">
          {friendRequests.map((item) => {
            return (
              <div className="dropdown-container__item">
                <div className="d-flex" style={{ gap: '1rem' }}>
                  <span className="dropdown-container__icon"></span>
                  <p>
                    <span className="bold">{item.sender}</span> Vam šalje zahtjev za
                    prijateljstvom.
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
