import React from 'react';
import styled from 'styled-components';
import { usePassword } from './PasswordProvider';
interface PasswordProps {
  name: string;
  label?: string;
  id?: string;
}

export const PasswordField: React.FC<PasswordProps> = ({ name, label, id }) => {
  const { password, setPassword } = usePassword();

  return (
    <div className="form-control">
      <label className="form-label" htmlFor={id}>
        {label}
      </label>
      <Input
        autoComplete={'new-password'}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        id={id}
        name={name}
      />
      {/* {getError()} */}
    </div>
  );
};

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  font-family: inherit;
  font-size: 14px;
  border: 1px solid black;
  border-radius: 0.8rem;
`;
