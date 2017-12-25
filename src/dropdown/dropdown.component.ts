import 'rxjs/add/operator/takeUntil';

import {
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  IterableDiffers,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  NG_VALUE_ACCESSOR,
  Validator,
} from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { MultiSelectSearchFilter } from './search-filter.pipe';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from './types';

/*
 * Angular 2 Dropdown Multiselect for Bootstrap
 *
 * Simon Lindh
 * https://github.com/softsimon/angular-2-dropdown-multiselect
 */

const MULTISELECT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MultiselectDropdown),
  multi: true
};

@Component({
  selector: 'ss-multiselect-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css'],
  providers: [MULTISELECT_VALUE_ACCESSOR, MultiSelectSearchFilter]
})
export class MultiselectDropdown implements OnInit, OnChanges, DoCheck, OnDestroy, ControlValueAccessor, Validator {

  filterControl: FormControl = this.fb.control('');

  @Input() options: Array<IMultiSelectOption>;
  @Input() settings: IMultiSelectSettings;
  @Input() texts: IMultiSelectTexts;
  @Input() disabled: boolean = false;
  @Input() disabledSelection: boolean = false;
  @Output() selectionLimitReached = new EventEmitter();
  @Output() dropdownClosed = new EventEmitter();
  @Output() dropdownOpened = new EventEmitter();
  @Output() onAdded = new EventEmitter();
  @Output() onRemoved = new EventEmitter();
  @Output() onLazyLoad = new EventEmitter();
  @Output() onFilter: Observable<string> = this.filterControl.valueChanges;

  @HostListener('document: click', ['$event.target'])
  @HostListener('document: touchstart', ['$event.target'])
  onClick(target: HTMLElement) {
    if (!this.isVisible || !this.settings.closeOnClickOutside) return;
    let parentFound = false;
    while (target != null && !parentFound) {
      if (target === this.element.nativeElement) {
        parentFound = true;
      }
      target = target.parentElement;
    }
    if (!parentFound) {
      this.isVisible = false;
      this.focusBack = true;
      this.dropdownClosed.emit();
    }
  }

  destroyed$ = new Subject<any>();

  filteredOptions: IMultiSelectOption[] = [];
  lazyLoadOptions: IMultiSelectOption[] = [];
  renderFilteredOptions: IMultiSelectOption[] = [];
  model: any[] = [];
  prevModel: any[] = [];
  parents: any[];
  title: string;
  differ: any;
  numSelected: number = 0;
  set isVisible(val: boolean) {
    this._isVisible = val;
    this._workerDocClicked = val ? false : this._workerDocClicked;
  }
  get isVisible() {
    return this._isVisible;
  }
  renderItems = true;
  checkAllSearchRegister = new Set();
  checkAllStatus = false;
  loadedValueIds = [];
  focusBack = false;
  focusedItem: IMultiSelectOption | undefined;

  defaultSettings: IMultiSelectSettings = {
    closeOnClickOutside: true,
    pullRight: false,
    enableSearch: false,
    searchRenderLimit: 0,
    searchRenderAfter: 1,
    searchMaxLimit: 0,
    searchMaxRenderedItems: 0,
    checkedStyle: 'checkboxes',
    buttonClasses: 'btn btn-default btn-secondary',
    containerClasses: 'dropdown-inline',
    selectionLimit: 0,
    minSelectionLimit: 0,
    closeOnSelect: false,
    autoUnselect: false,
    showCheckAll: false,
    showUncheckAll: false,
    fixedTitle: false,
    dynamicTitleMaxItems: 3,
    maxHeight: '300px',
    isLazyLoad: false,
    stopScrollPropagation: false,
    loadViewDistance: 1,
    selectAddedValues: false,
    ignoreLabels: false
  };
  defaultTexts: IMultiSelectTexts = {
    checkAll: 'Check all',
    uncheckAll: 'Uncheck all',
    checked: 'checked',
    checkedPlural: 'checked',
    searchPlaceholder: 'Search...',
    searchEmptyResult: 'Nothing found...',
    searchNoRenderText: 'Type in search box to see results...',
    defaultTitle: 'Select',
    allSelected: 'All selected',
  };

  get searchLimit() {
    return this.settings.searchRenderLimit;
  }

  get searchRenderAfter() {
    return this.settings.searchRenderAfter;
  }

  get searchLimitApplied() {
    return this.searchLimit > 0 && this.options.length > this.searchLimit;
  }

  private _isVisible = false;
  private _workerDocClicked = false;

  constructor(private element: ElementRef,
    private fb: FormBuilder,
    private searchFilter: MultiSelectSearchFilter,
    differs: IterableDiffers) {
    this.differ = differs.find([]).create(null);
    this.settings = this.defaultSettings;
    this.texts = this.defaultTexts;
  }

  getItemStyle(option: IMultiSelectOption): any {
    if (!option.isLabel) {
      return { 'cursor': 'pointer' };
    }
  }

  getItemStyleSelectionDisabled(): any {
    if (this.disabledSelection) {
      return { 'cursor': 'default' };
    }
  }


  ngOnInit() {
    this.settings = Object.assign(this.defaultSettings, this.settings);
    this.texts = Object.assign(this.defaultTexts, this.texts);
    this.title = this.texts.defaultTitle || '';

    this.filterControl.valueChanges
      .takeUntil(this.destroyed$)
      .subscribe(() => {
        this.updateRenderItems();
        if (this.settings.isLazyLoad) {
          this.load();
        }
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['options']) {
      this.options = this.options || [];
      this.parents = this.options
        .filter(option => typeof option.parentId === 'number')
        .map(option => option.parentId);
      this.updateRenderItems();

      if (this.settings.isLazyLoad && this.settings.selectAddedValues && this.loadedValueIds.length === 0) {
        this.loadedValueIds = this.loadedValueIds.concat(changes.options.currentValue.map(value => value.id));
      }
      if (this.settings.isLazyLoad && this.settings.selectAddedValues && changes.options.previousValue) {
        let addedValues = changes.options.currentValue.filter(
          value => this.loadedValueIds.indexOf(value.id) === -1
        );
        this.loadedValueIds.concat(addedValues.map(value => value.id));
        if (this.checkAllStatus) {
          this.addChecks(addedValues);
        } else if (this.checkAllSearchRegister.size > 0) {
          this.checkAllSearchRegister.forEach(
            searchValue => this.addChecks(this.applyFilters(addedValues, searchValue))
          );
        }
      }

      if (this.texts) {
        this.updateTitle();
      }

      this.fireModelChange();
    }

    if (changes['texts'] && !changes['texts'].isFirstChange()) {
      this.updateTitle();
    }
  }

  ngOnDestroy() {
    this.destroyed$.next();
  }

  updateRenderItems() {
    this.renderItems = !this.searchLimitApplied || this.filterControl.value.length >= this.searchRenderAfter;
    this.filteredOptions = this.applyFilters(this.options, this.settings.isLazyLoad ? '' : this.filterControl.value);
    this.renderFilteredOptions = this.renderItems ? this.filteredOptions : [];
    this.focusedItem = undefined;
  }

  applyFilters(options, value) {
    return (this.searchFilter.transform(
      options,
      value,
      this.settings.searchMaxLimit,
      this.settings.searchMaxRenderedItems
    ));
  }

  fireModelChange() {
    if (this.model != this.prevModel) {
      this.prevModel = this.model;
      this.onModelChange(this.model);
      this.onModelTouched();
    }
  }

  onModelChange: Function = (_: any) => { };
  onModelTouched: Function = () => { };

  writeValue(value: any): void {
    if (value !== undefined && value !== null) {
      this.model = Array.isArray(value) ? value : [value];
    } else {
      this.model = [];
    }
  }

  registerOnChange(fn: Function): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onModelTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  ngDoCheck() {
    const changes = this.differ.diff(this.model);
    if (changes) {
      this.updateNumSelected();
      this.updateTitle();
    }
  }

  validate(_c: AbstractControl): { [key: string]: any; } {
    return (this.model && this.model.length) ? null : {
      required: {
        valid: false,
      },
    };
  }

  registerOnValidatorChange(_fn: () => void): void {
    throw new Error('Method not implemented.');
  }

  clearSearch(event: Event) {
    this.maybeStopPropagation(event);
    this.filterControl.setValue('');
  }

  toggleDropdown(e?: Event) {
    this.maybeStopPropagation(e);

    if (this.isVisible) {
      this.focusBack = true;
    }

    this.isVisible = !this.isVisible;
    this.isVisible ? this.dropdownOpened.emit() : this.dropdownClosed.emit();
    this.focusedItem = undefined;
  }

  closeDropdown(e?: Event) {
    this.isVisible = true;
    this.toggleDropdown(e);
  }

  isSelected(option: IMultiSelectOption): boolean {
    return this.model && this.model.indexOf(option.id) > -1;
  }

  setSelected(_event: Event, option: IMultiSelectOption) {
    if (option.isLabel) {
      return;
    }

    if (!this.disabledSelection) {
      this.maybeStopPropagation(_event);
      this.maybePreventDefault(_event);
      const index = this.model.indexOf(option.id);
      const isAtSelectionLimit = this.settings.selectionLimit > 0 && this.model.length >= this.settings.selectionLimit;
      const removeItem = (idx, id): void => {
        this.model.splice(idx, 1);
        this.onRemoved.emit(id);
        if (this.settings.isLazyLoad && this.lazyLoadOptions.some(val => val.id === id)) {
          this.lazyLoadOptions.splice(this.lazyLoadOptions.indexOf(this.lazyLoadOptions.find(val => val.id === id)), 1);
        }
      };

      if (index > -1) {
        if ((this.settings.minSelectionLimit === undefined) || (this.numSelected > this.settings.minSelectionLimit)) {
          removeItem(index, option.id);
        }
        const parentIndex = option.parentId && this.model.indexOf(option.parentId);
        if (parentIndex > -1) {
          removeItem(parentIndex, option.parentId);
        } else if (this.parents.indexOf(option.id) > -1) {
          this.options.filter(child => this.model.indexOf(child.id) > -1 && child.parentId === option.id)
            .forEach(child => removeItem(this.model.indexOf(child.id), child.id));
        }
      } else if (isAtSelectionLimit && !this.settings.autoUnselect) {
        this.selectionLimitReached.emit(this.model.length);
        return;
      } else {
        const addItem = (id): void => {
          this.model.push(id);
          this.onAdded.emit(id);
          if (this.settings.isLazyLoad && !this.lazyLoadOptions.some(val => val.id === id)) {
            this.lazyLoadOptions.push(option);
          }
        };

        addItem(option.id);
        if (!isAtSelectionLimit) {
          if (option.parentId && !this.settings.ignoreLabels) {
            let children = this.options.filter(child => child.id !== option.id && child.parentId === option.parentId);
            if (children.every(child => this.model.indexOf(child.id) > -1)) {
              addItem(option.parentId);
            }
          } else if (this.parents.indexOf(option.id) > -1) {
            let children = this.options.filter(child => this.model.indexOf(child.id) < 0 && child.parentId === option.id);
            children.forEach(child => addItem(child.id));
          }
        } else {
          removeItem(0, this.model[0]);
        }
      }
      if (this.settings.closeOnSelect) {
        this.toggleDropdown();
      }
      this.model = this.model.slice();
      this.fireModelChange();
    }
  }

  updateNumSelected() {
    this.numSelected = this.model.filter(id => this.parents.indexOf(id) < 0).length || 0;
  }

  updateTitle() {
    let numSelectedOptions = this.options.length;
    if (this.settings.ignoreLabels) {
      numSelectedOptions = this.options.filter((option: IMultiSelectOption) => !option.isLabel).length;
    }
    if (this.numSelected === 0 || this.settings.fixedTitle) {
      this.title = (this.texts) ? this.texts.defaultTitle : '';
    } else if (this.settings.displayAllSelectedText && this.model.length === numSelectedOptions) {
      this.title = (this.texts) ? this.texts.allSelected : '';
    } else if (this.settings.dynamicTitleMaxItems && this.settings.dynamicTitleMaxItems >= this.numSelected) {
      let useOptions = this.settings.isLazyLoad && this.lazyLoadOptions.length ? this.lazyLoadOptions : this.options;
      this.title = useOptions
        .filter((option: IMultiSelectOption) =>
          this.model.indexOf(option.id) > -1
        )
        .map((option: IMultiSelectOption) => option.name)
        .join(', ');
    } else {
      this.title = this.numSelected
        + ' '
        + (this.numSelected === 1 ? this.texts.checked : this.texts.checkedPlural);
    }
  }

  searchFilterApplied() {
    return this.settings.enableSearch && this.filterControl.value && this.filterControl.value.length > 0;
  }

  addChecks(options) {
    let checkedOptions = options
      .filter((option: IMultiSelectOption) => {
        if (this.model.indexOf(option.id) === -1 && !(this.settings.ignoreLabels && option.isLabel)) {
          this.onAdded.emit(option.id);
          return true;
        }
        return false;
      }).map((option: IMultiSelectOption) => option.id);
    this.model = this.model.concat(checkedOptions);
  }

  checkAll() {
    if (!this.disabledSelection) {
      this.addChecks(!this.searchFilterApplied() ? this.options : this.filteredOptions);
      if (this.settings.isLazyLoad && this.settings.selectAddedValues) {
        if (this.searchFilterApplied() && !this.checkAllStatus) {
          this.checkAllSearchRegister.add(this.filterControl.value);
        } else {
          this.checkAllSearchRegister.clear();
          this.checkAllStatus = true;
        }
        this.load();
      }
      this.fireModelChange();
    }
  }

  uncheckAll() {
    if (!this.disabledSelection) {
      let checkedOptions = this.model;
      let unCheckedOptions = (!this.searchFilterApplied() ? this.model
        : this.filteredOptions.map((option: IMultiSelectOption) => option.id)
      );
      // set unchecked options only to the ones that were checked
      unCheckedOptions = checkedOptions.filter(item => this.model.includes(item));
      this.model = this.model.filter((id: number) => {
        if (((unCheckedOptions.indexOf(id) < 0) && (this.settings.minSelectionLimit === undefined)) || ((unCheckedOptions.indexOf(id) < this.settings.minSelectionLimit))) {
          return true;
        } else {
          this.onRemoved.emit(id);
          return false;
        }
      });
      if (this.settings.isLazyLoad && this.settings.selectAddedValues) {
        if (this.searchFilterApplied()) {
          if (this.checkAllSearchRegister.has(this.filterControl.value)) {
            this.checkAllSearchRegister.delete(this.filterControl.value);
            this.checkAllSearchRegister.forEach((searchTerm) => {
              let filterOptions = this.applyFilters(this.options.filter(option => unCheckedOptions.includes(option.id)), searchTerm);
              this.addChecks(filterOptions);
            });
          }
        } else {
          this.checkAllSearchRegister.clear();
          this.checkAllStatus = false;
        }
        this.load();

      }
      this.fireModelChange();
    }
  }

  preventCheckboxCheck(event: Event, option: IMultiSelectOption) {
    if (this.settings.selectionLimit && !this.settings.autoUnselect &&
      this.model.length >= this.settings.selectionLimit &&
      this.model.indexOf(option.id) === -1 &&
      this.maybePreventDefault(event)
    ) {
      this.maybePreventDefault(event);
    }
  }

  isCheckboxDisabled(): boolean {
    return this.disabledSelection;
  }

  checkScrollPosition(ev) {
    let scrollTop = ev.target.scrollTop;
    let scrollHeight = ev.target.scrollHeight;
    let scrollElementHeight = ev.target.clientHeight;
    let roundingPixel = 1;
    let gutterPixel = 1;

    if (scrollTop >= scrollHeight - (1 + this.settings.loadViewDistance) * scrollElementHeight - roundingPixel - gutterPixel) {
      this.load();
    }
  }

  checkScrollPropagation(ev, element) {
    let scrollTop = element.scrollTop;
    let scrollHeight = element.scrollHeight;
    let scrollElementHeight = element.clientHeight;

    if ((ev.deltaY > 0 && scrollTop + scrollElementHeight >= scrollHeight) || (ev.deltaY < 0 && scrollTop <= 0)) {
      ev = ev || window.event;
      this.maybePreventDefault(ev);
      ev.returnValue = false;
    }
  }

  load() {
    this.onLazyLoad.emit({
      length: this.options.length,
      filter: this.filterControl.value,
      checkAllSearches: this.checkAllSearchRegister,
      checkAllStatus: this.checkAllStatus
    });
  }

  focusItem(dir: number, e?: Event) {
    if (!this.isVisible) {
      return;
    }

    this.maybePreventDefault(e);

    const idx = this.filteredOptions.indexOf(this.focusedItem);

    if (idx === -1) {
      this.focusedItem = this.filteredOptions[0];
      return;
    }

    const nextIdx = idx + dir;
    const newIdx = nextIdx < 0
      ? this.filteredOptions.length - 1
      : nextIdx % this.filteredOptions.length;

    this.focusedItem = this.filteredOptions[newIdx];
  }

  private maybePreventDefault(e?: { preventDefault?: Function }) {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
  }

  private maybeStopPropagation(e?: { stopPropagation?: Function }) {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
  }

}
