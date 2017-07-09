import { Pipe, PipeTransform } from '@angular/core';
import { IMultiSelectOption } from './types';

@Pipe({
  name: 'searchFilter'
})
export class MultiSelectSearchFilter implements PipeTransform {

  private _lastOptions: IMultiSelectOption[];
  private _searchCache: { [k: string]: IMultiSelectOption[] } = {};

  transform(options: Array<IMultiSelectOption>, str: string, limit = 0): Array<IMultiSelectOption> {
    str = (str || '').toLowerCase();

    // Drop cache because options were updated
    if (options !== this._lastOptions) {
      this._searchCache = {};
    }

    if (this._searchCache[str]) {
      return this._searchCache[str];
    }

    const prevResults = this._searchCache[str.slice(0, -1)];

    // If have previous results, do only subsearch
    if (prevResults) {
      options = prevResults;
    }

    const optsLength = options.length;
    const maxFound = limit > 0 ? Math.min(limit, optsLength) : optsLength;
    const filteredOpts = [];

    const matchPredicate = (option: IMultiSelectOption) => option.name.toLowerCase().includes(str),
      getChildren = (option: IMultiSelectOption) => options.filter(child => child.parentId === option.id),
      getParent = (option: IMultiSelectOption) => options.find(parent => option.parentId === parent.id);

    for (let i = 0, founded = 0; i < optsLength && founded < maxFound; ++i) {
      const option = options[i];
      const directMatch = option.name.toLowerCase().includes(str);

      if (directMatch) {
        filteredOpts.push(option);
        founded++;
        continue;
      }

      if (typeof (option.parentId) === 'undefined') {
        const childrenMatch = getChildren(option).some(matchPredicate);

        if (childrenMatch) {
          filteredOpts.push(option);
          founded++;
          continue;
        }
      }

      if (typeof (option.parentId) !== 'undefined') {
        const parentMatch = matchPredicate(getParent(option));

        if (parentMatch) {
          filteredOpts.push(option);
          founded++;
          continue;
        }
      }
    }

    return this._searchCache[str] = filteredOpts;
  }
}
