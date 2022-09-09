import Select from 'react-select';
import { ConnectedFieldProps, connectField } from 'uniforms';

const SelectField = ({ onChange, options, label }: ConnectedFieldProps<any>) => {
  const onChangeWrapper = (value: any) => {
    if (!onChange) {
      return;
    }

    if (value === null) {
      onChange(null);
    } else {
      onChange(value);
    }
  };

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
        onChange={onChangeWrapper}
        isClearable={true}
      />
    </div>
  );
};

export default connectField(SelectField, { initialValue: false });
