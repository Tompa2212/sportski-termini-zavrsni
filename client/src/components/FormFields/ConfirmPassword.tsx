import React, { useState } from 'react';
import styled from 'styled-components';
import { usePassword } from './PasswordProvider';

interface ConfirmPasswordProps {
  name: string;
  label?: string;
  id?: string;
}

export const ConfirmPassword: React.FC<ConfirmPasswordProps> = ({
  name,
  label,
  id,
}) => {
  const { password } = usePassword();
  const [innerPassword, setInnerPassword] = useState('');

  const [touched, setTouched] = useState(false);

  const errorMessage =
    password !== innerPassword ? 'Lozinke moraju biti jednake' : null;
  const displayErrorMessage = touched && errorMessage;

  return (
    <div className="form-control">
      <label className="form-label" htmlFor={id}>
        {label}
      </label>
      <Input
        autoComplete={'new-password'}
        type="password"
        value={innerPassword}
        onChange={(e) => setInnerPassword(e.target.value)}
        id={id}
        name={name}
        onBlur={() => setTouched(true)}
      />
      {displayErrorMessage ? (
        <span role="alert" className="form-error">
          {errorMessage}
        </span>
      ) : null}
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
