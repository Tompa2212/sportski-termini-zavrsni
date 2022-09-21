import { useState } from 'react';
import styled from 'styled-components';

interface ImageFieldProps {
  id?: string;
  name: string;
  label: string;
}

export const ImageField = ({ id, name, label }: ImageFieldProps) => {
  const [value, setValue] = useState<File | null>(null);

  const imgSrc = value ? URL.createObjectURL(value) : '';

  return (
    <Wrapper className="form-control">
      <label htmlFor={id}>
        <div style={{ marginBottom: '0.5rem' }}>{label}</div>
        {value ? <img alt="" src={imgSrc} /> : null}
      </label>
      <input
        accept="image/*"
        id={id}
        name={name}
        onChange={({ target: { files } }) => {
          const file = files ? files[0] : null;

          setValue(file);
        }}
        // style={{ display: 'none' }}
        type="file"
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  label {
    display: block;
    margin-bottom: 0.5rem;

    img {
      cursor: pointer;
      object-fit: cover;
      width: 10rem;
      height: 8rem;
    }
  }
`;
