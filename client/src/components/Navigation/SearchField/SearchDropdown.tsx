import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useOnClickOutside } from '../../../hooks/useOnClickOutside';
import { BaseUser } from '../../../models/user';
import { ProfilePhoto } from '../../ProfilePhoto';

interface Props {
  onClose: () => void;
  loading: boolean;
  options: BaseUser[];
}

const getContent = (options: BaseUser[], loading: boolean) => {
  if (options.length === 0 && loading) {
    return <div>Tražim...</div>;
  }

  if (options.length === 0 && !loading) {
    return <div>Korisnik nije pronađen</div>;
  }

  return options.map((option) => (
    <div className="search-field__item" key={option.id}>
      <ProfilePhoto
        style={{ width: '3rem', height: '3rem' }}
        src={option.profilePhotoSrc}
      />
      <div>
        <Link to={`/korisnik/${option.username}`}>{option.username}</Link>
        <span>Korisnik</span>
      </div>
    </div>
  ));
};

export const SearchDropdown: React.FC<Props> = ({ onClose, options, loading }) => {
  const dropdownRef = useRef(null);

  useOnClickOutside(dropdownRef, onClose);

  return (
    <div className="search-field__dropdown" ref={dropdownRef}>
      {getContent(options, loading)}
    </div>
  );
};
