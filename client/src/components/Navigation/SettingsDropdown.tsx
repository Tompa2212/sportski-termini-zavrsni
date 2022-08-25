import { useState } from 'react';
import { ReactComponent as ArrowIcon } from '../../assets/icons/arrow.svg';
import { useUser } from '../../providers/authProvider';
import { DropdownMenu } from './DropdownMenu';

export const SettingsDropdown = () => {
  const user = useUser();
  const [open, setOpen] = useState(false);

  if (!user) {
    return null;
  }

  return (
    <div>
      <div
        className="settings__dropdown"
        onClick={() => setOpen((prev) => !prev)}
        style={{ cursor: 'pointer' }}
      >
        <span>{user.username}</span>
        <ArrowIcon width={25} height={25} fill="var(--text-color)" />
        {open && <DropdownMenu onClickOutside={() => setOpen(false)} />}
      </div>
    </div>
  );
};
