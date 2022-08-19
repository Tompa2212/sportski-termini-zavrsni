import { sportTermFilterableProps } from '../constants/graphNodes.js';
import { cleanObject } from './cleanObject.js';

export const queryParamsToMapLiteral = (paramsObj = {}, paramsObjName) => {
  if (!paramsObjName) {
    return;
  }
  const queryParams = cleanObject(paramsObj, sportTermFilterableProps);

  const literalsStringArr = Object.keys(queryParams).reduce((mapLiteral, currKey) => {
    return [...mapLiteral, `${currKey}: $${paramsObjName}.${currKey}`];
  }, []);

  return `{${literalsStringArr.join(', ')}}`;
};
