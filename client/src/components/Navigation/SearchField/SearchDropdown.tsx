import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useOnClickOutside } from '../../../hooks/useOnClickOutside';

interface User {
  id: string;
  username: string;
}

interface Props {
  onClose: () => void;
  loading: boolean;
  options: User[];
}

const getContent = (options: User[], loading: boolean) => {
  if (options.length === 0 && loading) {
    return <div>Loading...</div>;
  }

  if (options.length === 0 && !loading) {
    return <div>No users found</div>;
  }

  return options.map((option) => {
    return (
      <div className="search-field__item" key={option.id}>
        <span className="search-field__icon"></span>
        <Link to={`/korisnik/${option.username}`}>{option.username}</Link>
      </div>
    );
  });
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
