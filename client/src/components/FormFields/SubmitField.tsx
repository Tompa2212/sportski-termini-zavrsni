import React from 'react';
import styled from 'styled-components';

const isModelEmpty = (model: Record<string, any>) => {
  if (Object.keys(model || {}).length === 0) {
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
  formData?: any;
}

export const SubmitField: React.FC<SubmitFieldProps> = ({
  title,
  className,
  formData,
}) => {
  return (
    <Button type="submit" className={className} disabled={isModelEmpty(formData)}>
      {title}
    </Button>
  );
};

const Button = styled.button``;
