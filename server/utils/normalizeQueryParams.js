import { int, integer, Date as neoDate, Time } from 'neo4j-driver';
import { cleanObject } from './cleanObject.js';
import { sportTermFilterableProps } from '../constants/graphNodes.js';

function validateHhMm(value) {
  var isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(value);

  return isValid;
}

export const normalizeQueryParams = (paramsObj) => {
  const queryParams = cleanObject(paramsObj, sportTermFilterableProps);

  return Object.entries(queryParams).reduce((finalObj, [currKey, currVal]) => {
    let finalVal = currVal;

    if (currVal === 'true') {
      finalVal = true;
    } else if (currVal === 'false') {
      finalVal = false;
    } else if (!isNaN(currVal)) {
      if (currVal.indexOf('.') === -1) {
        finalVal = int(currVal);
      } else {
        finalVal = integer.toNumber(currVal);
      }
    } else if (Date.parse(currVal)) {
      const [year, month, day] = currVal.split('-').map((val) => int(val));

      finalVal = new neoDate(year, month, day);
    } else if (validateHhMm(currVal)) {
      const [hours, minutes] = currVal.split(':').map((val) => int(val));

      finalVal = new Time(hours, minutes, 0, 0, 0);
    }

    return {
      ...finalObj,
      [currKey]: finalVal,
    };
  }, {});
};
