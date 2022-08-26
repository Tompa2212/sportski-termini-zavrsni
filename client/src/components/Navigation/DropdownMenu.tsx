import React, { useRef } from 'react';
import { ReactComponent as PersonIcon } from '../../assets/icons/person.svg';
import { ReactComponent as SettingsIcon } from '../../assets/icons/settings.svg';
import { ReactComponent as LogoutIcon } from '../../assets/icons/logout.svg';

import { CSSTransition } from 'react-transition-group';
import { useAuth } from '../../providers/authProvider';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';

const DropdownItem = (props: {
  children?: React.ReactNode;
  leftIcon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <a className={`menu__item ${props.className}`} onClick={props.onClick}>
      {props.leftIcon}
      {props.children}
    </a>
  );
};

export const DropdownMenu: React.FC = () => {
  const { signout } = useAuth();

  return (
    <div className="dropdown" style={{ height: 200 }}>
      <CSSTransition in timeout={500} classNames="menu-primary" unmountOnExit>
        <div className="menu">
          <DropdownItem leftIcon={<PersonIcon className="menu__icon" />}>
            Moj Profil
          </DropdownItem>
          <DropdownItem leftIcon={<SettingsIcon className="menu__icon" />}>
            Postavke
          </DropdownItem>
          <hr></hr>
          <DropdownItem
            className="menu__item--red"
            onClick={signout}
            leftIcon={<LogoutIcon className="menu__icon menu__icon--red" />}
          >
            Odjava
          </DropdownItem>
        </div>
      </CSSTransition>
    </div>
  );
};
