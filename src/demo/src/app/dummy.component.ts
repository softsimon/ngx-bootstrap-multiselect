import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { IMultiSelectSettings } from '../../../..';
import { DataModel } from './data-model';

@Component({
  selector: 'app-dummy',
  templateUrl: './dummy.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DummyComponent {

  @Input() data: DataModel;

  settings: IMultiSelectSettings = {
    enableSearch: true,
  };
}
