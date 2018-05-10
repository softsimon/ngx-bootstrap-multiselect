import { Pipe, Directive, ElementRef, Host, Input, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, HostListener, IterableDiffers, Output, NgModule } from '@angular/core';
import { FormBuilder, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class MultiSelectSearchFilter {
    constructor() {
        this._searchCache = {};
        this._searchCacheInclusive = {};
        this._prevSkippedItems = {};
    }
    /**
     * @param {?} options
     * @param {?=} str
     * @param {?=} limit
     * @param {?=} renderLimit
     * @return {?}
     */
    transform(options, str = '', limit = 0, renderLimit = 0) {
        str = str.toLowerCase();
        // Drop cache because options were updated
        if (options !== this._lastOptions) {
            this._lastOptions = options;
            this._searchCache = {};
            this._searchCacheInclusive = {};
            this._prevSkippedItems = {};
        }
        const /** @type {?} */ filteredOpts = this._searchCache.hasOwnProperty(str)
            ? this._searchCache[str]
            : this._doSearch(options, str, limit);
        const /** @type {?} */ isUnderLimit = options.length <= limit;
        return isUnderLimit
            ? filteredOpts
            : this._limitRenderedItems(filteredOpts, renderLimit);
    }
    /**
     * @param {?} options
     * @param {?} prevOptions
     * @param {?} prevSearchStr
     * @return {?}
     */
    _getSubsetOptions(options, prevOptions, prevSearchStr) {
        const /** @type {?} */ prevInclusiveOrIdx = this._searchCacheInclusive[prevSearchStr];
        if (prevInclusiveOrIdx === true) {
            // If have previous results and it was inclusive, do only subsearch
            return prevOptions;
        }
        else if (typeof prevInclusiveOrIdx === 'number') {
            // Or reuse prev results with unchecked ones
            return [...prevOptions, ...options.slice(prevInclusiveOrIdx)];
        }
        return options;
    }
    /**
     * @param {?} options
     * @param {?} str
     * @param {?} limit
     * @return {?}
     */
    _doSearch(options, str, limit) {
        const /** @type {?} */ prevStr = str.slice(0, -1);
        const /** @type {?} */ prevResults = this._searchCache[prevStr];
        const /** @type {?} */ prevResultShift = this._prevSkippedItems[prevStr] || 0;
        if (prevResults) {
            options = this._getSubsetOptions(options, prevResults, prevStr);
        }
        const /** @type {?} */ optsLength = options.length;
        const /** @type {?} */ maxFound = limit > 0 ? Math.min(limit, optsLength) : optsLength;
        const /** @type {?} */ regexp = new RegExp(this._escapeRegExp(str), 'i');
        const /** @type {?} */ filteredOpts = [];
        let /** @type {?} */ i = 0, /** @type {?} */ founded = 0, /** @type {?} */ removedFromPrevResult = 0;
        const /** @type {?} */ doesOptionMatch = (option) => regexp.test(option.name);
        const /** @type {?} */ getChildren = (option) => options.filter(child => child.parentId === option.id);
        const /** @type {?} */ getParent = (option) => options.find(parent => option.parentId === parent.id);
        const /** @type {?} */ foundFn = (item) => { filteredOpts.push(item); founded++; };
        const /** @type {?} */ notFoundFn = prevResults ? () => removedFromPrevResult++ : () => { };
        for (; i < optsLength && founded < maxFound; ++i) {
            const /** @type {?} */ option = options[i];
            const /** @type {?} */ directMatch = doesOptionMatch(option);
            if (directMatch) {
                foundFn(option);
                continue;
            }
            if (typeof option.parentId === 'undefined') {
                const /** @type {?} */ childrenMatch = getChildren(option).some(doesOptionMatch);
                if (childrenMatch) {
                    foundFn(option);
                    continue;
                }
            }
            if (typeof option.parentId !== 'undefined') {
                const /** @type {?} */ parentMatch = doesOptionMatch(getParent(option));
                if (parentMatch) {
                    foundFn(option);
                    continue;
                }
            }
            notFoundFn();
        }
        const /** @type {?} */ totalIterations = i + prevResultShift;
        this._searchCache[str] = filteredOpts;
        this._searchCacheInclusive[str] = i === optsLength || totalIterations;
        this._prevSkippedItems[str] = removedFromPrevResult + prevResultShift;
        return filteredOpts;
    }
    /**
     * @template T
     * @param {?} items
     * @param {?} limit
     * @return {?}
     */
    _limitRenderedItems(items, limit) {
        return items.length > limit && limit > 0 ? items.slice(0, limit) : items;
    }
    /**
     * @param {?} str
     * @return {?}
     */
    _escapeRegExp(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }
}
MultiSelectSearchFilter.decorators = [
    { type: Pipe, args: [{
                name: 'searchFilter'
            },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class AutofocusDirective {
    /**
     * @param {?} elemRef
     */
    constructor(elemRef) {
        this.elemRef = elemRef;
    }
    /**
     * @return {?}
     */
    get element() {
        return this.elemRef.nativeElement;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.focus();
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        const /** @type {?} */ ssAutofocusChange = changes["ssAutofocus"];
        if (ssAutofocusChange && !ssAutofocusChange.isFirstChange()) {
            this.focus();
        }
    }
    /**
     * @return {?}
     */
    focus() {
        if (this.ssAutofocus) {
            return;
        }
        this.element.focus && this.element.focus();
    }
}
AutofocusDirective.decorators = [
    { type: Directive, args: [{
                selector: '[ssAutofocus]'
            },] },
];
/** @nocollapse */
AutofocusDirective.ctorParameters = () => [
    { type: ElementRef, decorators: [{ type: Host },] },
];
AutofocusDirective.propDecorators = {
    "ssAutofocus": [{ type: Input },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/*
 * Angular 2 Dropdown Multiselect for Bootstrap
 *
 * Simon Lindh
 * https://github.com/softsimon/angular-2-dropdown-multiselect
 */
const MULTISELECT_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MultiselectDropdownComponent),
    multi: true,
};
class MultiselectDropdownComponent {
    /**
     * @param {?} element
     * @param {?} fb
     * @param {?} searchFilter
     * @param {?} differs
     * @param {?} cdRef
     */
    constructor(element, fb, searchFilter, differs, cdRef) {
        this.element = element;
        this.fb = fb;
        this.searchFilter = searchFilter;
        this.cdRef = cdRef;
        this.filterControl = this.fb.control('');
        this.disabled = false;
        this.disabledSelection = false;
        this.selectionLimitReached = new EventEmitter();
        this.dropdownClosed = new EventEmitter();
        this.dropdownOpened = new EventEmitter();
        this.onAdded = new EventEmitter();
        this.onRemoved = new EventEmitter();
        this.onLazyLoad = new EventEmitter();
        this.onFilter = this.filterControl.valueChanges;
        this.destroyed$ = new Subject();
        this.filteredOptions = [];
        this.lazyLoadOptions = [];
        this.renderFilteredOptions = [];
        this.model = [];
        this.prevModel = [];
        this.numSelected = 0;
        this.renderItems = true;
        this.checkAllSearchRegister = new Set();
        this.checkAllStatus = false;
        this.loadedValueIds = [];
        this._focusBack = false;
        this.defaultSettings = {
            closeOnClickOutside: true,
            pullRight: false,
            enableSearch: false,
            searchRenderLimit: 0,
            searchRenderAfter: 1,
            searchMaxLimit: 0,
            searchMaxRenderedItems: 0,
            checkedStyle: 'checkboxes',
            buttonClasses: 'btn btn-primary dropdown-toggle',
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
            ignoreLabels: false,
            maintainSelectionOrderInTitle: false,
            focusBack: true
        };
        this.defaultTexts = {
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
        this._isVisible = false;
        this._workerDocClicked = false;
        this.onModelChange = (_) => { };
        this.onModelTouched = () => { };
        this.differ = differs.find([]).create(null);
        this.settings = this.defaultSettings;
        this.texts = this.defaultTexts;
    }
    /**
     * @return {?}
     */
    get focusBack() {
        return this.settings.focusBack && this._focusBack;
    }
    /**
     * @param {?} target
     * @return {?}
     */
    onClick(target) {
        if (!this.isVisible || !this.settings.closeOnClickOutside) {
            return;
        }
        let /** @type {?} */ parentFound = false;
        while (target != null && !parentFound) {
            if (target === this.element.nativeElement) {
                parentFound = true;
            }
            target = target.parentElement;
        }
        if (!parentFound) {
            this.isVisible = false;
            this._focusBack = true;
            this.dropdownClosed.emit();
        }
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set isVisible(val) {
        this._isVisible = val;
        this._workerDocClicked = val ? false : this._workerDocClicked;
    }
    /**
     * @return {?}
     */
    get isVisible() {
        return this._isVisible;
    }
    /**
     * @return {?}
     */
    get searchLimit() {
        return this.settings.searchRenderLimit;
    }
    /**
     * @return {?}
     */
    get searchRenderAfter() {
        return this.settings.searchRenderAfter;
    }
    /**
     * @return {?}
     */
    get searchLimitApplied() {
        return this.searchLimit > 0 && this.options.length > this.searchLimit;
    }
    /**
     * @param {?} option
     * @return {?}
     */
    getItemStyle(option) {
        if (!option.isLabel) {
            
        }
        if (option.disabled) {
            
        }
    }
    /**
     * @return {?}
     */
    getItemStyleSelectionDisabled() {
        if (this.disabledSelection) {
            return { cursor: 'default' };
        }
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.title = this.texts.defaultTitle || '';
        this.filterControl.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(() => {
            this.updateRenderItems();
            if (this.settings.isLazyLoad) {
                this.load();
            }
        });
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes['options']) {
            this.options = this.options || [];
            this.parents = this.options
                .filter(option => typeof option.parentId === 'number')
                .map(option => option.parentId);
            this.updateRenderItems();
            if (this.settings.isLazyLoad &&
                this.settings.selectAddedValues &&
                this.loadedValueIds.length === 0) {
                this.loadedValueIds = this.loadedValueIds.concat(changes["options"].currentValue.map(value => value.id));
            }
            if (this.settings.isLazyLoad &&
                this.settings.selectAddedValues &&
                changes["options"].previousValue) {
                const /** @type {?} */ addedValues = changes["options"].currentValue.filter(value => this.loadedValueIds.indexOf(value.id) === -1);
                this.loadedValueIds.concat(addedValues.map(value => value.id));
                if (this.checkAllStatus) {
                    this.addChecks(addedValues);
                }
                else if (this.checkAllSearchRegister.size > 0) {
                    this.checkAllSearchRegister.forEach(searchValue => this.addChecks(this.applyFilters(addedValues, searchValue)));
                }
            }
            if (this.texts) {
                this.updateTitle();
            }
            this.fireModelChange();
        }
        if (changes['settings']) {
            this.settings = Object.assign({}, this.defaultSettings, this.settings);
        }
        if (changes['texts']) {
            this.texts = Object.assign({}, this.defaultTexts, this.texts);
            if (!changes['texts'].isFirstChange()) {
                this.updateTitle();
            }
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.destroyed$.next();
    }
    /**
     * @return {?}
     */
    updateRenderItems() {
        this.renderItems =
            !this.searchLimitApplied ||
                this.filterControl.value.length >= this.searchRenderAfter;
        this.filteredOptions = this.applyFilters(this.options, this.settings.isLazyLoad ? '' : this.filterControl.value);
        this.renderFilteredOptions = this.renderItems ? this.filteredOptions : [];
        this.focusedItem = undefined;
    }
    /**
     * @param {?} options
     * @param {?} value
     * @return {?}
     */
    applyFilters(options, value) {
        return this.searchFilter.transform(options, value, this.settings.searchMaxLimit, this.settings.searchMaxRenderedItems);
    }
    /**
     * @return {?}
     */
    fireModelChange() {
        if (this.model != this.prevModel) {
            this.prevModel = this.model;
            this.onModelChange(this.model);
            this.onModelTouched();
            this.cdRef.markForCheck();
        }
    }
    /**
     * @param {?} value
     * @return {?}
     */
    writeValue(value) {
        if (value !== undefined && value !== null) {
            this.model = Array.isArray(value) ? value : [value];
            this.ngDoCheck();
        }
        else {
            this.model = [];
        }
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) {
        this.onModelChange = fn;
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) {
        this.onModelTouched = fn;
    }
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
    }
    /**
     * @return {?}
     */
    ngDoCheck() {
        const /** @type {?} */ changes = this.differ.diff(this.model);
        if (changes) {
            this.updateNumSelected();
            this.updateTitle();
        }
    }
    /**
     * @param {?} _c
     * @return {?}
     */
    validate(_c) {
        if (this.model && this.model.length) {
            return {
                required: {
                    valid: false
                }
            };
        }
        if (this.options.filter(o => this.model.indexOf(o.id) && !o.disabled).length === 0) {
            return {
                selection: {
                    valid: false
                }
            };
        }
        return null;
    }
    /**
     * @param {?} _fn
     * @return {?}
     */
    registerOnValidatorChange(_fn) {
        throw new Error('Method not implemented.');
    }
    /**
     * @param {?} event
     * @return {?}
     */
    clearSearch(event) {
        this.maybeStopPropagation(event);
        this.filterControl.setValue('');
    }
    /**
     * @param {?=} e
     * @return {?}
     */
    toggleDropdown(e) {
        this.maybeStopPropagation(e);
        if (this.isVisible) {
            this._focusBack = true;
        }
        this.isVisible = !this.isVisible;
        this.isVisible ? this.dropdownOpened.emit() : this.dropdownClosed.emit();
        this.focusedItem = undefined;
    }
    /**
     * @param {?=} e
     * @return {?}
     */
    closeDropdown(e) {
        this.isVisible = true;
        this.toggleDropdown(e);
    }
    /**
     * @param {?} option
     * @return {?}
     */
    isSelected(option) {
        return this.model && this.model.indexOf(option.id) > -1;
    }
    /**
     * @param {?} _event
     * @param {?} option
     * @return {?}
     */
    setSelected(_event, option) {
        if (option.isLabel) {
            return;
        }
        if (option.disabled) {
            return;
        }
        if (this.disabledSelection) {
            return;
        }
        setTimeout(() => {
            this.maybeStopPropagation(_event);
            this.maybePreventDefault(_event);
            const /** @type {?} */ index = this.model.indexOf(option.id);
            const /** @type {?} */ isAtSelectionLimit = this.settings.selectionLimit > 0 &&
                this.model.length >= this.settings.selectionLimit;
            const /** @type {?} */ removeItem = (idx, id) => {
                this.model.splice(idx, 1);
                this.onRemoved.emit(id);
                if (this.settings.isLazyLoad &&
                    this.lazyLoadOptions.some(val => val.id === id)) {
                    this.lazyLoadOptions.splice(this.lazyLoadOptions.indexOf(this.lazyLoadOptions.find(val => val.id === id)), 1);
                }
            };
            if (index > -1) {
                if (this.settings.minSelectionLimit === undefined ||
                    this.numSelected > this.settings.minSelectionLimit) {
                    removeItem(index, option.id);
                }
                const /** @type {?} */ parentIndex = option.parentId && this.model.indexOf(option.parentId);
                if (parentIndex > -1) {
                    removeItem(parentIndex, option.parentId);
                }
                else if (this.parents.indexOf(option.id) > -1) {
                    this.options
                        .filter(child => this.model.indexOf(child.id) > -1 &&
                        child.parentId === option.id)
                        .forEach(child => removeItem(this.model.indexOf(child.id), child.id));
                }
            }
            else if (isAtSelectionLimit && !this.settings.autoUnselect) {
                this.selectionLimitReached.emit(this.model.length);
                return;
            }
            else {
                const /** @type {?} */ addItem = (id) => {
                    this.model.push(id);
                    this.onAdded.emit(id);
                    if (this.settings.isLazyLoad &&
                        !this.lazyLoadOptions.some(val => val.id === id)) {
                        this.lazyLoadOptions.push(option);
                    }
                };
                addItem(option.id);
                if (!isAtSelectionLimit) {
                    if (option.parentId && !this.settings.ignoreLabels) {
                        const /** @type {?} */ children = this.options.filter(child => child.id !== option.id && child.parentId === option.parentId);
                        if (children.every(child => this.model.indexOf(child.id) > -1)) {
                            addItem(option.parentId);
                        }
                    }
                    else if (this.parents.indexOf(option.id) > -1) {
                        const /** @type {?} */ children = this.options.filter(child => this.model.indexOf(child.id) < 0 && child.parentId === option.id);
                        children.forEach(child => addItem(child.id));
                    }
                }
                else {
                    removeItem(0, this.model[0]);
                }
            }
            if (this.settings.closeOnSelect) {
                this.toggleDropdown();
            }
            this.model = this.model.slice();
            this.fireModelChange();
        }, 0);
    }
    /**
     * @return {?}
     */
    updateNumSelected() {
        this.numSelected =
            this.model.filter(id => this.parents.indexOf(id) < 0).length || 0;
    }
    /**
     * @return {?}
     */
    updateTitle() {
        let /** @type {?} */ numSelectedOptions = this.options.length;
        if (this.settings.ignoreLabels) {
            numSelectedOptions = this.options.filter((option) => !option.isLabel).length;
        }
        if (this.numSelected === 0 || this.settings.fixedTitle) {
            this.title = this.texts ? this.texts.defaultTitle : '';
        }
        else if (this.settings.displayAllSelectedText &&
            this.model.length === numSelectedOptions) {
            this.title = this.texts ? this.texts.allSelected : '';
        }
        else if (this.settings.dynamicTitleMaxItems &&
            this.settings.dynamicTitleMaxItems >= this.numSelected) {
            const /** @type {?} */ useOptions = this.settings.isLazyLoad && this.lazyLoadOptions.length
                ? this.lazyLoadOptions
                : this.options;
            let /** @type {?} */ titleSelections;
            if (this.settings.maintainSelectionOrderInTitle) {
                const /** @type {?} */ optionIds = useOptions.map((selectOption, idx) => selectOption.id);
                titleSelections = this.model
                    .map((selectedId) => optionIds.indexOf(selectedId))
                    .filter((optionIndex) => optionIndex > -1)
                    .map((optionIndex) => useOptions[optionIndex]);
            }
            else {
                titleSelections = useOptions.filter((option) => this.model.indexOf(option.id) > -1);
            }
            this.title = titleSelections.map((option) => option.name).join(', ');
        }
        else {
            this.title =
                this.numSelected +
                    ' ' +
                    (this.numSelected === 1
                        ? this.texts.checked
                        : this.texts.checkedPlural);
        }
        this.cdRef.markForCheck();
    }
    /**
     * @return {?}
     */
    searchFilterApplied() {
        return (this.settings.enableSearch &&
            this.filterControl.value &&
            this.filterControl.value.length > 0);
    }
    /**
     * @param {?} options
     * @return {?}
     */
    addChecks(options) {
        const /** @type {?} */ checkedOptions = options
            .filter((option) => {
            if (!option.disabled &&
                (this.model.indexOf(option.id) === -1 &&
                    !(this.settings.ignoreLabels && option.isLabel))) {
                this.onAdded.emit(option.id);
                return true;
            }
            return false;
        })
            .map((option) => option.id);
        this.model = this.model.concat(checkedOptions);
    }
    /**
     * @return {?}
     */
    checkAll() {
        if (!this.disabledSelection) {
            this.addChecks(!this.searchFilterApplied() ? this.options : this.filteredOptions);
            if (this.settings.isLazyLoad && this.settings.selectAddedValues) {
                if (this.searchFilterApplied() && !this.checkAllStatus) {
                    this.checkAllSearchRegister.add(this.filterControl.value);
                }
                else {
                    this.checkAllSearchRegister.clear();
                    this.checkAllStatus = true;
                }
                this.load();
            }
            this.fireModelChange();
        }
    }
    /**
     * @return {?}
     */
    uncheckAll() {
        if (!this.disabledSelection) {
            const /** @type {?} */ checkedOptions = this.model;
            let /** @type {?} */ unCheckedOptions = !this.searchFilterApplied()
                ? this.model
                : this.filteredOptions.map((option) => option.id);
            // set unchecked options only to the ones that were checked
            unCheckedOptions = checkedOptions.filter(item => this.model.indexOf(item) > -1);
            this.model = this.model.filter((id) => {
                if ((unCheckedOptions.indexOf(id) < 0 &&
                    this.settings.minSelectionLimit === undefined) ||
                    unCheckedOptions.indexOf(id) < this.settings.minSelectionLimit) {
                    return true;
                }
                else {
                    this.onRemoved.emit(id);
                    return false;
                }
            });
            if (this.settings.isLazyLoad && this.settings.selectAddedValues) {
                if (this.searchFilterApplied()) {
                    if (this.checkAllSearchRegister.has(this.filterControl.value)) {
                        this.checkAllSearchRegister.delete(this.filterControl.value);
                        this.checkAllSearchRegister.forEach(function (searchTerm) {
                            const /** @type {?} */ filterOptions = this.applyFilters(this.options.filter(option => unCheckedOptions.indexOf(option.id) > -1), searchTerm);
                            this.addChecks(filterOptions);
                        });
                    }
                }
                else {
                    this.checkAllSearchRegister.clear();
                    this.checkAllStatus = false;
                }
                this.load();
            }
            this.fireModelChange();
        }
    }
    /**
     * @param {?} event
     * @param {?} option
     * @return {?}
     */
    preventCheckboxCheck(event, option) {
        if (option.disabled ||
            (this.settings.selectionLimit &&
                !this.settings.autoUnselect &&
                this.model.length >= this.settings.selectionLimit &&
                this.model.indexOf(option.id) === -1 &&
                this.maybePreventDefault(event))) {
            this.maybePreventDefault(event);
        }
    }
    /**
     * @param {?=} option
     * @return {?}
     */
    isCheckboxDisabled(option) {
        return this.disabledSelection || option && option.disabled;
    }
    /**
     * @param {?} ev
     * @return {?}
     */
    checkScrollPosition(ev) {
        const /** @type {?} */ scrollTop = ev.target.scrollTop;
        const /** @type {?} */ scrollHeight = ev.target.scrollHeight;
        const /** @type {?} */ scrollElementHeight = ev.target.clientHeight;
        const /** @type {?} */ roundingPixel = 1;
        const /** @type {?} */ gutterPixel = 1;
        if (scrollTop >=
            scrollHeight -
                (1 + this.settings.loadViewDistance) * scrollElementHeight -
                roundingPixel -
                gutterPixel) {
            this.load();
        }
    }
    /**
     * @param {?} ev
     * @param {?} element
     * @return {?}
     */
    checkScrollPropagation(ev, element) {
        const /** @type {?} */ scrollTop = element.scrollTop;
        const /** @type {?} */ scrollHeight = element.scrollHeight;
        const /** @type {?} */ scrollElementHeight = element.clientHeight;
        if ((ev.deltaY > 0 && scrollTop + scrollElementHeight >= scrollHeight) ||
            (ev.deltaY < 0 && scrollTop <= 0)) {
            ev = ev || window.event;
            this.maybePreventDefault(ev);
            ev.returnValue = false;
        }
    }
    /**
     * @param {?} idx
     * @param {?} selectOption
     * @return {?}
     */
    trackById(idx, selectOption) {
        return selectOption.id;
    }
    /**
     * @return {?}
     */
    load() {
        this.onLazyLoad.emit({
            length: this.options.length,
            filter: this.filterControl.value,
            checkAllSearches: this.checkAllSearchRegister,
            checkAllStatus: this.checkAllStatus,
        });
    }
    /**
     * @param {?} dir
     * @param {?=} e
     * @return {?}
     */
    focusItem(dir, e) {
        if (!this.isVisible) {
            return;
        }
        this.maybePreventDefault(e);
        const /** @type {?} */ idx = this.filteredOptions.indexOf(this.focusedItem);
        if (idx === -1) {
            this.focusedItem = this.filteredOptions[0];
            return;
        }
        const /** @type {?} */ nextIdx = idx + dir;
        const /** @type {?} */ newIdx = nextIdx < 0
            ? this.filteredOptions.length - 1
            : nextIdx % this.filteredOptions.length;
        this.focusedItem = this.filteredOptions[newIdx];
    }
    /**
     * @param {?=} e
     * @return {?}
     */
    maybePreventDefault(e) {
        if (e && e.preventDefault) {
            e.preventDefault();
        }
    }
    /**
     * @param {?=} e
     * @return {?}
     */
    maybeStopPropagation(e) {
        if (e && e.stopPropagation) {
            e.stopPropagation();
        }
    }
}
MultiselectDropdownComponent.decorators = [
    { type: Component, args: [{
                selector: 'ss-multiselect-dropdown',
                template: `<div class="dropdown">
  <button type="button" class="dropdown-toggle" [ngClass]="settings.buttonClasses" (click)="toggleDropdown($event)" [disabled]="disabled"
    [ssAutofocus]="!focusBack">
    {{ title }}
    <span class="caret"></span>
  </button>
  <div #scroller *ngIf="isVisible" class="dropdown-menu" [ngClass]="{'chunkydropdown-menu': settings.checkedStyle == 'visual' }"
    (scroll)="settings.isLazyLoad ? checkScrollPosition($event) : null" (wheel)="settings.stopScrollPropagation ? checkScrollPropagation($event, scroller) : null"
    [class.pull-right]="settings.pullRight" [class.dropdown-menu-right]="settings.pullRight" [style.max-height]="settings.maxHeight"
    style="display: block; height: auto; overflow-y: auto;" (keydown.tab)="focusItem(1, $event)" (keydown.shift.tab)="focusItem(-1, $event)">
    <div class="input-group search-container" *ngIf="settings.enableSearch">
      <div class="input-group-prepend">
        <span class="input-group-text" id="basic-addon1">
          <i class="fa fa-search" aria-hidden="true"></i>
        </span>
      </div>
      <input type="text" class="form-control" ssAutofocus [formControl]="filterControl" [placeholder]="texts.searchPlaceholder"
        class="form-control">
      <div class="input-group-append" *ngIf="filterControl.value.length>0">
        <button class="btn btn-default btn-secondary" type="button" (click)="clearSearch($event)">
          <i class="fa fa-times"></i>
        </button>
      </div>
    </div>
    <a role="menuitem" href="javascript:;" tabindex="-1" class="dropdown-item check-control check-control-check" *ngIf="settings.showCheckAll && !disabledSelection"
      (click)="checkAll()">
      <span style="width: 16px;"><span [ngClass]="{'glyphicon glyphicon-ok': settings.checkedStyle !== 'fontawesome','fa fa-check': settings.checkedStyle === 'fontawesome'}"></span></span>
      {{ texts.checkAll }}
    </a>
    <a role="menuitem" href="javascript:;" tabindex="-1" class="dropdown-item check-control check-control-uncheck" *ngIf="settings.showUncheckAll && !disabledSelection"
      (click)="uncheckAll()">
      <span style="width: 16px;"><span [ngClass]="{'glyphicon glyphicon-remove': settings.checkedStyle !== 'fontawesome','fa fa-times': settings.checkedStyle === 'fontawesome'}"></span></span>
      {{ texts.uncheckAll }}
    </a>
    <a *ngIf="settings.showCheckAll || settings.showUncheckAll" href="javascript:;" class="dropdown-divider divider"></a>
    <a *ngIf="!renderItems" href="javascript:;" class="dropdown-item empty">{{ texts.searchNoRenderText }}</a>
    <a *ngIf="renderItems && !renderFilteredOptions.length" href="javascript:;" class="dropdown-item empty">{{ texts.searchEmptyResult }}</a>
    <a class="dropdown-item" href="javascript:;" *ngFor="let option of renderFilteredOptions; trackBy: trackById" [class.active]="isSelected(option)"
      [ngStyle]="getItemStyle(option)" [ngClass]="option.classes" [class.dropdown-header]="option.isLabel" [ssAutofocus]="option !== focusedItem"
      tabindex="-1" (click)="setSelected($event, option)" (keydown.space)="setSelected($event, option)" (keydown.enter)="setSelected($event, option)">
      <span *ngIf="!option.isLabel; else label" role="menuitem" tabindex="-1" [style.padding-left]="this.parents.length>0&&this.parents.indexOf(option.id)<0&&'30px'"
        [ngStyle]="getItemStyleSelectionDisabled()">
        <ng-container [ngSwitch]="settings.checkedStyle">
          <input *ngSwitchCase="'checkboxes'" type="checkbox" [checked]="isSelected(option)" (click)="preventCheckboxCheck($event, option)"
            [disabled]="isCheckboxDisabled(option)" [ngStyle]="getItemStyleSelectionDisabled()" />
          <span *ngSwitchCase="'glyphicon'" style="width: 16px;" class="glyphicon" [class.glyphicon-ok]="isSelected(option)" [class.glyphicon-lock]="isCheckboxDisabled(option)"></span>
          <span *ngSwitchCase="'fontawesome'" style="width: 16px;display: inline-block;">
            <span *ngIf="isSelected(option)"><i class="fa fa-check" aria-hidden="true"></i></span>
            <span *ngIf="isCheckboxDisabled(option)"><i class="fa fa-lock" aria-hidden="true"></i></span>
          </span>
          <span *ngSwitchCase="'visual'" style="display:block;float:left; border-radius: 0.2em; border: 0.1em solid rgba(44, 44, 44, 0.63);background:rgba(0, 0, 0, 0.1);width: 5.5em;">
            <div class="slider" [ngClass]="{'slideron': isSelected(option)}">
              <img *ngIf="option.image != null" [src]="option.image" style="height: 100%; width: 100%; object-fit: contain" />
              <div *ngIf="option.image == null" style="height: 100%; width: 100%;text-align: center; display: table; background-color:rgba(0, 0, 0, 0.74)">
                <div class="content_wrapper">
                  <span style="font-size:3em;color:white" class="glyphicon glyphicon-eye-close"></span>
                </div>
              </div>
            </div>
          </span>
        </ng-container>
        <span [ngClass]="{'chunkyrow': settings.checkedStyle == 'visual' }" [class.disabled]="isCheckboxDisabled(option)" [ngClass]="settings.itemClasses"
          [style.font-weight]="this.parents.indexOf(option.id)>=0?'bold':'normal'">
          {{ option.name }}
        </span>
      </span>
      <ng-template #label>
        <span [class.disabled]="isCheckboxDisabled(option)">{{ option.name }}</span>
      </ng-template>
    </a>
  </div>
</div>
`,
                styles: [`a{outline:0!important}.dropdown-inline{display:inline-block}.dropdown-toggle .caret{margin-left:4px;white-space:nowrap;display:inline-block}.chunkydropdown-menu{min-width:20em}.chunkyrow{line-height:2;margin-left:1em;font-size:2em}.slider{width:3.8em;height:3.8em;display:block;-webkit-transition:all 125ms linear;transition:all 125ms linear;margin-left:.125em;margin-top:auto}.slideron{margin-left:1.35em}.content_wrapper{display:table-cell;vertical-align:middle}.search-container{padding:0 5px 5px}`],
                providers: [MULTISELECT_VALUE_ACCESSOR, MultiSelectSearchFilter],
                changeDetection: ChangeDetectionStrategy.OnPush
            },] },
];
/** @nocollapse */
MultiselectDropdownComponent.ctorParameters = () => [
    { type: ElementRef, },
    { type: FormBuilder, },
    { type: MultiSelectSearchFilter, },
    { type: IterableDiffers, },
    { type: ChangeDetectorRef, },
];
MultiselectDropdownComponent.propDecorators = {
    "options": [{ type: Input },],
    "settings": [{ type: Input },],
    "texts": [{ type: Input },],
    "disabled": [{ type: Input },],
    "disabledSelection": [{ type: Input },],
    "selectionLimitReached": [{ type: Output },],
    "dropdownClosed": [{ type: Output },],
    "dropdownOpened": [{ type: Output },],
    "onAdded": [{ type: Output },],
    "onRemoved": [{ type: Output },],
    "onLazyLoad": [{ type: Output },],
    "onFilter": [{ type: Output },],
    "onClick": [{ type: HostListener, args: ['document: click', ['$event.target'],] }, { type: HostListener, args: ['document: touchstart', ['$event.target'],] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class MultiselectDropdownModule {
}
MultiselectDropdownModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule, ReactiveFormsModule],
                exports: [
                    MultiselectDropdownComponent,
                    MultiSelectSearchFilter,
                ],
                declarations: [
                    MultiselectDropdownComponent,
                    MultiSelectSearchFilter,
                    AutofocusDirective,
                ],
            },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { MultiSelectSearchFilter, MultiselectDropdownModule, MultiselectDropdownComponent, AutofocusDirective as ɵa };
//# sourceMappingURL=angular-2-dropdown-multiselect.js.map
