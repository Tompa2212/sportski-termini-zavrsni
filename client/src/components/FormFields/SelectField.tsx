import React from 'react';
import Select from 'react-select';
import { ConnectedFieldProps, connectField } from 'uniforms';

const SelectField = ({
  value,
  onChange,
  options,
  label,
}: ConnectedFieldProps<any>) => {
  return (
    <div className="form-control">
      <label htmlFor="" className="form-label">
        {label}
      </label>
      <Select
        options={options}
        styles={{
          control: (styles, { isFocused }) => ({
            ...styles,
            background: 'var(--bg-color)',
            outline: isFocused ? '1px solid var(--primary)' : undefined,
            '$:hover': {
              borderColor: 'transparent',
              outlineColor: 'transparent',
            },
          }),
          option: (styles) => ({
            ...styles,
            ':active': {
              ...styles[':active'],
              outline: '1px solid var(--primary)',
            },
          }),
        }}
        onChange={(value: any) => onChange && onChange(value.value)}
      />
    </div>
  );
};

export default connectField(SelectField, { initialValue: false });
