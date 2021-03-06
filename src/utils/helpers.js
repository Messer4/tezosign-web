import numeral from 'numeral';
import bs58check from 'bs58check';
import { XTZInMutez, XTZFormat } from './constants';

const convertXTZToMutez = (amount) => {
  return `${Number(amount) * XTZInMutez}`;
};

const convertMutezToXTZ = (amount) => {
  return `${Number(amount) / XTZInMutez}`;
};

const formatXTZ = (amount) => {
  return numeral(amount).format(XTZFormat);
};

const bs58Validation = (value) => {
  try {
    bs58check.decode(value);
    return true;
  } catch (e) {
    return false;
  }
};

export { convertXTZToMutez, convertMutezToXTZ, formatXTZ, bs58Validation };
