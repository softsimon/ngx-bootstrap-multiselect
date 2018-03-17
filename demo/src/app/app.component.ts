import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DataService } from './data.service';
import { DataModel } from './data-model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {

  data$: Observable<DataModel>;

  constructor(private itemsService: DataService) {
    this.data$ = this.itemsService.getData(5);
  }
}
