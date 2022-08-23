import React from 'react';
import styled from 'styled-components';
import { useForm } from 'uniforms';

const isModelEmpty = (model: Record<string, any>) => {
  if (Object.keys(model).length === 0) {
    return true;
  }

  if (Object.values(model).every((value) => value === undefined || value === null)) {
    return true;
  }

  return false;
};

interface SubmitFieldProps {
  title: string;
  className?: string;
}

export const SubmitField: React.FC<SubmitFieldProps> = ({ title, className }) => {
  const { error, changed, model } = useForm();

  const disabled = error || !changed;

  return (
    <Button
      type="submit"
      className={className}
      disabled={disabled || isModelEmpty(model)}
    >
      {title}
    </Button>
  );
};

const Button = styled.button``;
