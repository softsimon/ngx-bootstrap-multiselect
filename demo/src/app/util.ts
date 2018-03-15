import { IMultiSelectOption } from '../../../src';

export const generateItem = (id: number): IMultiSelectOption => {
  return {id, name: `Item #${id}`};
};

export const generateOptions = (count: number): IMultiSelectOption[] => {
  return new Array(count)
    .fill(null)
    .map((_, i) => generateItem(i));
};
