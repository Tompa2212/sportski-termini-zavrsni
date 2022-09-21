import React, { useState } from 'react';
import styled from 'styled-components';

interface TextFieldProps {
  name: string;
  initialValue?: string;
  label?: string;
  type?: 'text' | 'email' | 'password';
  id?: string;
}

const TextField: React.FC<TextFieldProps> = ({
  name,
  initialValue = '',
  label,
  type,
  id,
}) => {
  const [value, setValue] = useState<string>(initialValue);
  const [touched, setTouched] = useState(false);

  return (
    <div className="form-control">
      <label className="form-label" htmlFor={id}>
        {label}
      </label>
      <Input
        autoComplete={type === 'password' ? 'new-password' : 'off'}
        value={value}
        id={id}
        name={name}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => setTouched(true)}
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

export default TextField;
