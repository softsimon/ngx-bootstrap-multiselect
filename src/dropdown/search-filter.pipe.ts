import { Pipe, PipeTransform } from '@angular/core';
import { IMultiSelectOption } from './types';

@Pipe({
  name: 'searchFilter'
})
export class MultiSelectSearchFilter implements PipeTransform {
  transform(options: Array<IMultiSelectOption>, args: string, limit = 0): Array<IMultiSelectOption> {
    const matchPredicate = (option: IMultiSelectOption) => option.name.toLowerCase().indexOf((args || '').toLowerCase()) > -1,
      getChildren = (option: IMultiSelectOption) => options.filter(child => child.parentId === option.id),
      getParent = (option: IMultiSelectOption) => options.find(parent => option.parentId === parent.id);

    let founded = 0, stopped = false;
    const opts = options.filter((option: IMultiSelectOption) => {
      if (stopped) {
        return false;
      }

      const found = matchPredicate(option) ||
        (typeof (option.parentId) === 'undefined' && getChildren(option).some(matchPredicate)) ||
        (typeof (option.parentId) !== 'undefined' && matchPredicate(getParent(option)));

      if (found && ++founded === limit) {
        stopped = true;
      }

      return found;
    });

    return opts;
  }
}
