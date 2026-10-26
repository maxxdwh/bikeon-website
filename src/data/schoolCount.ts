import schools from './schools.json';

export const schoolCount = schools.length;

/** Rounded marketing label, e.g. "440+" from 441. */
export const schoolCountLabel = `${Math.floor(schoolCount / 10) * 10}+`;
