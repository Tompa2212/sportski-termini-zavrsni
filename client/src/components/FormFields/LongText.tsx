import styled from 'styled-components';
import { connectField } from 'uniforms';
import { ConnectedFieldProps } from 'uniforms';

const LongText = (props: ConnectedFieldProps<any>) => {
  const { error, authError, label, id } = props;

  const onChangeHandler = (e: any) => {
    if (!props.onChange) {
      return;
    }

    const value = e.target.value;

    if (typeof value === 'string' && value.trim() === '') {
      props.onChange(null);
      return;
    }

    props.onChange(value);
  };

  const componentProps = {
    ...props,
    id,
    error,
    label,
    value: props.value || '',
    onChange: onChangeHandler,
  };

  const getError = () => {
    if (error) {
      return <span className="form-error">{error.message}</span>;
    }

    if (authError) {
      return <span className="form-error">{authError.message}</span>;
    }
  };

  return (
    <div className="form-control">
      <label className="form-label" htmlFor={id}>
        {label}
      </label>
      <Input
        {...componentProps}
        autoComplete={props.type === 'password' ? 'new-password' : 'off'}
        maxLength={255}
      />
      {getError()}
    </div>
  );
};

const Input = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  font-family: inherit;
  font-size: 14px;
  border: 1px solid black;
  border-radius: 0.8rem;
`;

export default connectField(LongText, { initialValue: false });
