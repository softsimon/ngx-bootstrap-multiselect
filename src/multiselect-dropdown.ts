/*
 * Angular 2 Dropdown Multiselect for Bootstrap
 *
 * Simon Lindh
 * https://github.com/softsimon/angular-2-dropdown-multiselect
 */

import {
  NgModule,
  Component,
  Pipe,
  OnInit,
  DoCheck,
  HostListener,
  Input,
  ElementRef,
  Output,
  EventEmitter,
  forwardRef,
  IterableDiffers,
  PipeTransform
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

const MULTISELECT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MultiselectDropdown),
  multi: true
};

export interface IMultiSelectOption {
  id: any;
  name: string;
  isLabel?: boolean;
  parentId?: any;
}

export interface IMultiSelectSettings {
  pullRight?: boolean;
  enableSearch?: boolean;
  checkedStyle?: 'checkboxes' | 'glyphicon' | 'fontawesome';
  buttonClasses?: string;
  selectionLimit?: number;
  closeOnSelect?: boolean;
  autoUnselect?: boolean;
  showCheckAll?: boolean;
  showUncheckAll?: boolean;
  dynamicTitleMaxItems?: number;
  maxHeight?: string;
  displayAllSelectedText?: boolean;
}

export interface IMultiSelectTexts {
  checkAll?: string;
  uncheckAll?: string;
  checked?: string;
  checkedPlural?: string;
  searchPlaceholder?: string;
  defaultTitle?: string;
  allSelected?: string;
}

@Pipe({
  name: 'searchFilter'
})
export class MultiSelectSearchFilter implements PipeTransform {
  transform(options: Array<IMultiSelectOption>, args: string): Array<IMultiSelectOption> {
    const matchPredicate = (option: IMultiSelectOption) => option.name.toLowerCase().indexOf((args || '').toLowerCase()) > -1,
            getChildren = (option: IMultiSelectOption) => options.filter(child => child.parentId === option.id),
            getParent = (option: IMultiSelectOption) => options.find(parent => option.parentId === parent.id);
    return options.filter((option: IMultiSelectOption) => {
        return matchPredicate(option) ||
            (typeof(option.parentId) === 'undefined' && getChildren(option).some(matchPredicate)) ||
            (typeof(option.parentId) !== 'undefined' && matchPredicate(getParent(option)));
    });
  }
}

@Component({
  selector: 'ss-multiselect-dropdown',
  providers: [MULTISELECT_VALUE_ACCESSOR],
  styles: [`
	   a { outline: none !important; }
  `],
  template: `
	<div class="dropdown">
	    <button type="button" class="dropdown-toggle" [ngClass]="settings.buttonClasses"
	    (click)="toggleDropdown()">{{ title }}&nbsp;<span class="caret"></span></button>
    <ul *ngIf="isVisible" class="dropdown-menu" [class.pull-right]="settings.pullRight" [class.dropdown-menu-right]="settings.pullRight"
  	    [style.max-height]="settings.maxHeight" style="display: block; height: auto; overflow-y: auto;">
  		<li class="dropdown-item" *ngIf="settings.enableSearch">
  		    <div class="input-group input-group-sm">
  			<span class="input-group-addon" id="sizing-addon3"><i class="fa fa-search"></i></span>
  			<input type="text" class="form-control" placeholder="{{ texts.searchPlaceholder }}"
  			aria-describedby="sizing-addon3" [(ngModel)]="searchFilterText">
  			<span class="input-group-btn" *ngIf="searchFilterText.length > 0">
  			    <button class="btn btn-default btn-secondary" type="button" (click)="clearSearch($event)"><i class="fa fa-times"></i></button>
  			</span>
  		    </div>
  		</li>
  		<li class="dropdown-divider divider" *ngIf="settings.enableSearch"></li>
  		<li class="dropdown-item" *ngIf="settings.showCheckAll">
  		    <a href="javascript:;" role="menuitem" tabindex="-1" (click)="checkAll()">
  			<span style="width: 16px;" class="glyphicon glyphicon-ok"></span>
  			{{ texts.checkAll }}
  		    </a>
  		</li>
  		<li class="dropdown-item" *ngIf="settings.showUncheckAll">
  		    <a href="javascript:;" role="menuitem" tabindex="-1" (click)="uncheckAll()">
  			<span style="width: 16px;" class="glyphicon glyphicon-remove"></span>
  			{{ texts.uncheckAll }}
  		    </a>
  		</li>
  		<li *ngIf="settings.showCheckAll || settings.showUncheckAll" class="dropdown-divider divider"></li>
  		<li class="dropdown-item" [style]="!option.isLabel && 'cursor: pointer'" *ngFor="let option of options | searchFilter:searchFilterText"
        (click)="!option.isLabel && setSelected($event, option)" [class.dropdown-header]="option.isLabel">
          <template [ngIf]="option.isLabel">
            {{ option.name }}
          </template>
  		    <a *ngIf="!option.isLabel" href="javascript:;" role="menuitem" tabindex="-1">
  			    <input *ngIf="settings.checkedStyle === 'checkboxes'" type="checkbox" [checked]="isSelected(option)" (click)="preventCheckboxCheck($event, option)" />
  			    <span *ngIf="settings.checkedStyle === 'glyphicon'" style="width: 16px;"
  			      class="glyphicon" [class.glyphicon-ok]="isSelected(option)"></span>
            <span *ngIf="settings.checkedStyle === 'fontawesome'" style="width: 16px;display: inline-block;">
  			      <i *ngIf="isSelected(option)" class="fa fa-check" aria-hidden="true"></i>
  			    </span>
  	        {{ option.name }}
  		    </a>
  	  </li>
    </ul>
	</div>
`
})
export class MultiselectDropdown implements OnInit, DoCheck, ControlValueAccessor {

  @Input() options: Array<IMultiSelectOption>;
  @Input() settings: IMultiSelectSettings;
  @Input() texts: IMultiSelectTexts;
  @Output() selectionLimitReached = new EventEmitter();
  @Output() dropdownClosed = new EventEmitter();
  @Output() onAdded = new EventEmitter();
  @Output() onRemoved = new EventEmitter();

  @HostListener('document: click', ['$event.target'])
  onClick(target: HTMLElement) {
    let parentFound = false;
    while (target != null && !parentFound) {
      if (target === this.element.nativeElement) {
        parentFound = true;
      }
      target = target.parentElement;
    }
    if (!parentFound) {
      this.isVisible = false;
      this.dropdownClosed.emit();
    }
  }

  model: number[];
  title: string;
  differ: any;
  numSelected: number = 0;
  isVisible: boolean = false;
  searchFilterText: string = '';
  defaultSettings: IMultiSelectSettings = {
    pullRight: false,
    enableSearch: false,
    checkedStyle: 'checkboxes',
    buttonClasses: 'btn btn-default btn-secondary',
    selectionLimit: 0,
    closeOnSelect: false,
    autoUnselect: false,
    showCheckAll: false,
    showUncheckAll: false,
    dynamicTitleMaxItems: 3,
    maxHeight: '300px',
  };
  defaultTexts: IMultiSelectTexts = {
    checkAll: 'Check all',
    uncheckAll: 'Uncheck all',
    checked: 'checked',
    checkedPlural: 'checked',
    searchPlaceholder: 'Search...',
    defaultTitle: 'Select',
    allSelected: 'All selected',
  };

  constructor(private element: ElementRef,
    differs: IterableDiffers) {
    this.differ = differs.find([]).create(null);
  }

  ngOnInit() {
    this.settings = Object.assign(this.defaultSettings, this.settings);
    this.texts = Object.assign(this.defaultTexts, this.texts);
    this.title = this.texts.defaultTitle || '';
  }

  onModelChange: Function = (_: any) => { };
  onModelTouched: Function = () => { };

  writeValue(value: any): void {
    if (value !== undefined) {
      this.model = value;
    }
  }

  registerOnChange(fn: Function): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onModelTouched = fn;
  }

  ngDoCheck() {
    const changes = this.differ.diff(this.model);
    if (changes) {
      this.updateNumSelected();
      this.updateTitle();
    }
  }

  clearSearch(event: Event) {
    event.stopPropagation();
    this.searchFilterText = '';
  }

  toggleDropdown() {
    this.isVisible = !this.isVisible;
    if (!this.isVisible) {
      this.dropdownClosed.emit();
    }
  }

  isSelected(option: IMultiSelectOption): boolean {
    return this.model && this.model.indexOf(option.id) > -1;
  }

  setSelected(event: Event, option: IMultiSelectOption) {
    if (!this.model) {
      this.model = [];
    }
    const index = this.model.indexOf(option.id);
    if (index > -1) {
      this.model.splice(index, 1);
      this.onRemoved.emit(option.id);
    } else {
      if (this.settings.selectionLimit === 0 || (this.settings.selectionLimit && this.model.length < this.settings.selectionLimit)) {
        this.model.push(option.id);
        this.onAdded.emit(option.id);
      } else {
        if (this.settings.autoUnselect) {
          this.model.push(option.id);
          this.onAdded.emit(option.id);
          const removedOption = this.model.shift();
          this.onRemoved.emit(removedOption);
        } else {
          this.selectionLimitReached.emit(this.model.length);
          return;
        }
      }
    }
    if (this.settings.closeOnSelect) {
      this.toggleDropdown();
    }
    this.onModelChange(this.model);
  }

  updateNumSelected() {
    this.numSelected = this.model && this.model.length || 0;
  }

  updateTitle() {
    if (this.numSelected === 0) {
      this.title = this.texts.defaultTitle || '';
    } else if (this.settings.dynamicTitleMaxItems && this.settings.dynamicTitleMaxItems >= this.numSelected) {
      this.title = this.options
        .filter((option: IMultiSelectOption) =>
          this.model && this.model.indexOf(option.id) > -1
        )
        .map((option: IMultiSelectOption) => option.name)
        .join(', ');
    } else if (this.settings.displayAllSelectedText && this.model.length === this.options.length) {
      this.title = this.texts.allSelected || '';
    } else {
      this.title = this.numSelected
        + ' '
        + (this.numSelected === 1 ? this.texts.checked : this.texts.checkedPlural);
    }
  }

  checkAll() {
    this.model = this.options
      .map((option: IMultiSelectOption) => {
        if (this.model.indexOf(option.id) === -1) {
          this.onAdded.emit(option.id);
        }
        return option.id;
      });
    this.onModelChange(this.model);
  }

  uncheckAll() {
    this.model.forEach((id: number) => this.onRemoved.emit(id));
    this.model = [];
    this.onModelChange(this.model);
  }

  preventCheckboxCheck(event: Event, option: IMultiSelectOption) {
    if (this.settings.selectionLimit &&
      this.model.length >= this.settings.selectionLimit &&
      this.model.indexOf(option.id) === -1
    ) {
      event.preventDefault();
    }
  }
}

@NgModule({
  imports: [CommonModule, FormsModule],
  exports: [MultiselectDropdown],
  declarations: [MultiselectDropdown, MultiSelectSearchFilter],
})
export class MultiselectDropdownModule {}
