import React from 'react';
import { SportTerm } from '../../../models/SportTerm';

interface SportTermItemProps {
  sportTerm: SportTerm;
}

export const SportTermItem: React.FC<SportTermItemProps> = ({ sportTerm }) => {
  return <div>SportTermItem</div>;
};
