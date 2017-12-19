import { Component, ChangeDetectionStrategy } from '@angular/core';

import { IMultiSelectOption, IMultiSelectSettings } from '../../../..';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {

  static ITEMS = 0;

  options = this.generateOptions(5);

  settings: IMultiSelectSettings = {
    enableSearch: true,
  };

  generateItem(id = AppComponent.ITEMS++): IMultiSelectOption {
    return { id, name: `Item #${id}` };
  }

  generateOptions(count: number): IMultiSelectOption[] {
    return new Array(count)
      .fill(null)
      .map((_, i) => this.generateItem(i));
  }

}
