import React from 'react';
import { useUser } from '../../providers/authProvider';

type Props = {};

export const UserEditPage = (props: Props) => {
  const user = useUser();

  return <div>UserEditPage</div>;
};
