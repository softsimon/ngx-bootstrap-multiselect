import { Pipe, PipeTransform } from '@angular/core';
import { IMultiSelectOption } from './types';

@Pipe({
  name: 'searchFilter'
})
export class MultiSelectSearchFilter implements PipeTransform {

  private _lastOptions: IMultiSelectOption[];
  private _searchCache: { [k: string]: IMultiSelectOption[] } = {};
  private _searchCacheInclusive: { [k: string]: boolean } = {};

  transform(options: Array<IMultiSelectOption>, str: string, limit = 0, renderLimit = 0): Array<IMultiSelectOption> {
    str = (str || '').toLowerCase();

    // Drop cache because options were updated
    if (options !== this._lastOptions) {
      this._lastOptions = options;
      this._searchCache = {};
      this._searchCacheInclusive = {};
    }

    if (this._searchCache[str]) {
      return this._limitRenderedItems(this._searchCache[str], renderLimit);
    }

    const prevStr = str.slice(0, -1);
    const prevResults = this._searchCache[prevStr];

    // If have previous results and it was inclusive, do only subsearch
    if (prevResults && this._searchCacheInclusive[prevStr]) {
      options = prevResults;
    }

    const optsLength = options.length;
    const maxFound = limit > 0 ? Math.min(limit, optsLength) : optsLength;
    const filteredOpts = [];

    const regexp = new RegExp(this._escapeRegExp(str), 'i');

    const matchPredicate = (option: IMultiSelectOption) => regexp.test(option.name),
      getChildren = (option: IMultiSelectOption) => options.filter(child => child.parentId === option.id),
      getParent = (option: IMultiSelectOption) => options.find(parent => option.parentId === parent.id);

    let i = 0, founded = 0;
    for (; i < optsLength && founded < maxFound; ++i) {
      const option = options[i];
      const directMatch = regexp.test(option.name);

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

    this._searchCache[str] = filteredOpts;
    this._searchCacheInclusive[str] = i === optsLength;

    return this._limitRenderedItems(filteredOpts, renderLimit);
  }

  private _limitRenderedItems<T>(items: T[], limit: number): T[] {
    return items.length > limit ? items.slice(0, limit) : items;
  }

  private _escapeRegExp(str: string): string {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  }
}
