import { ReactComponent as SearchIcon } from '../../../assets/icons/search.svg';
import { useApi } from '../../../providers/apiProvider';
import { useEffect, useState } from 'react';
import { SearchDropdown } from './SearchDropdown';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue';
import { appRequestLinks } from '../../../utils/appLinks';

const getUsersHref = appRequestLinks.getUsers;

interface UsersState {
  users: {
    id: string;
    username: string;
  }[];
  loading: boolean;
}

type Response = {
  users: { id: string; username: string }[];
};

const initialState = {
  users: [],
  loading: false,
};

export const UserSearch = () => {
  const [searchValue, setSearchValue] = useState('');
  const [users, setUsers] = useState<UsersState>(initialState);
  const [open, setOpen] = useState(false);

  const debouncedValue = useDebouncedValue(searchValue, 300);
  const makeRequest = useApi();

  const canSearch = debouncedValue.length > 1;

  useEffect(() => {
    const getUsers = async () => {
      setUsers((prev) => ({ ...prev, loading: true }));
      const data = await makeRequest<Response>({
        href: `${getUsersHref}${debouncedValue}`,
        type: 'GET',
      });

      setUsers({ users: data?.users || [], loading: false });
    };

    if (canSearch) {
      getUsers();
    }
  }, [debouncedValue, makeRequest, canSearch]);

  const onClose = () => {
    setOpen(false);
    setSearchValue('');
  };

  return (
    <div className="search-field">
      <label htmlFor="search-field">
        <SearchIcon />
      </label>
      <input
        type="text"
        id="search-field"
        placeholder="Pretraži korisnike"
        autoComplete="off"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onClick={() => setOpen(true)}
      />
      {open && canSearch && (
        <SearchDropdown
          onClose={onClose}
          options={users.users}
          loading={users.loading}
        />
      )}
    </div>
  );
};
