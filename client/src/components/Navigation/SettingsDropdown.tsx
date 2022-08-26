import { useRef, useState } from 'react';
import { ReactComponent as ArrowIcon } from '../../assets/icons/arrow.svg';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { useUser } from '../../providers/authProvider';
import { DropdownMenu } from './DropdownMenu';

export const SettingsDropdown = () => {
  const user = useUser();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(dropdownRef, () => setOpen(false));

  if (!user) {
    return null;
  }

  return (
    <div
      className="settings__dropdown"
      style={{ cursor: 'pointer' }}
      ref={dropdownRef}
    >
      <div
        className="d-flex"
        style={{ gap: '.7rem' }}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>{user.username}</span>
        <ArrowIcon width={25} height={25} fill="var(--text-color)" />
      </div>
      {open && <DropdownMenu />}
    </div>
  );
};
