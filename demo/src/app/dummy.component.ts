import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { IMultiSelectSettings, IMultiSelectOption } from '../../../src';
import { DataModel } from './data-model';

@Component({
  selector: 'app-dummy',
  templateUrl: './dummy.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DummyComponent {

  @Input() data: DataModel;
  multiOptions: IMultiSelectOption[] = [
    {id:0, name:'parent1'},
    {id:1, name:'child1', parentId: 0},
    {id:2, name:'child2', parentId: 0},
    {id:3, name:'child3', parentId: 0},
    {id:4, name:'child4', parentId: 0},
    {id:5, name:'parent2'},
    {id:6, name:'zchild5', parentId: 5},
    {id:7, name:'child6', parentId: 5},
    {id:8, name:'child7', parentId: 5},
    {id:9, name:'child8', parentId: 5},
    {id:10, name:'parent3'},
    {id:11, name:'child9', parentId: 10},
    {id:12, name:'child10', parentId: 10},
    {id:13, name:'child11', parentId: 10},
    {id:14, name:'child12', parentId: 10},
    {id:15, name:'parent4'},
    {id:16, name:'child13', parentId: 15},
    {id:17, name:'child14', parentId: 15},
    {id:18, name:'child15', parentId: 15},
    {id:19, name:'parent5'},
    {id:20, name:'child16', parentId: 19},
    {id:21, name:'child16', parentId: 19},
    {id:22, name:'child17'},
    {id:23, name:'child18'},
    {id:24, name:'child18'}
  ]

  settings: IMultiSelectSettings = {
    enableSearch: true,
    showCheckAll: true,
    showUncheckAll: true
  };

  prefixSearchFunction(str: string): RegExp {
    return new RegExp('^' + str, 'i');
  }
}
