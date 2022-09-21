import React from 'react';
import styled from 'styled-components';

interface SubmitFieldProps {
  title: string;
  className?: string;
  formData?: any;
}

export const SubmitField: React.FC<SubmitFieldProps> = ({ title, className }) => {
  return (
    <Button type="submit" className={className}>
      {title}
    </Button>
  );
};

const Button = styled.button``;
