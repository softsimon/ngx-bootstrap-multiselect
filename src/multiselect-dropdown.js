/*
 * Angular 2 Dropdown Multiselect for Bootstrap
 * Current version: 0.3.2
 *
 * Simon Lindh
 * https://github.com/softsimon/angular-2-dropdown-multiselect
 */
System.register(["@angular/core", "@angular/common", "@angular/forms"], function (exports_1, context_1) {
    "use strict";
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var __moduleName = context_1 && context_1.id;
    var core_1, common_1, forms_1, MULTISELECT_VALUE_ACCESSOR, MultiSelectSearchFilter, MultiselectDropdown, MultiselectDropdownModule;
    return {
        setters: [
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (forms_1_1) {
                forms_1 = forms_1_1;
            }
        ],
        execute: function () {/*
             * Angular 2 Dropdown Multiselect for Bootstrap
             * Current version: 0.3.2
             *
             * Simon Lindh
             * https://github.com/softsimon/angular-2-dropdown-multiselect
             */
            MULTISELECT_VALUE_ACCESSOR = {
                provide: forms_1.NG_VALUE_ACCESSOR,
                useExisting: core_1.forwardRef(function () { return MultiselectDropdown; }),
                multi: true
            };
            MultiSelectSearchFilter = (function () {
                function MultiSelectSearchFilter() {
                }
                MultiSelectSearchFilter.prototype.transform = function (options, args) {
                    return options.filter(function (option) { return option.name.toLowerCase().indexOf((args || '').toLowerCase()) > -1; });
                };
                return MultiSelectSearchFilter;
            }());
            MultiSelectSearchFilter = __decorate([
                core_1.Pipe({
                    name: 'searchFilter'
                }),
                __metadata("design:paramtypes", [])
            ], MultiSelectSearchFilter);
            exports_1("MultiSelectSearchFilter", MultiSelectSearchFilter);
            MultiselectDropdown = (function () {
                function MultiselectDropdown(element, differs) {
                    this.element = element;
                    this.differs = differs;
                    this.selectionLimitReached = new core_1.EventEmitter();
                    this.dropdownClosed = new core_1.EventEmitter();
                    this.onModelChange = function (_) {
                    };
                    this.onModelTouched = function () {
                    };
                    this.numSelected = 0;
                    this.isVisible = false;
                    this.searchFilterText = '';
                    this.defaultSettings = {
                        pullRight: false,
                        enableSearch: false,
                        checkedStyle: 'checkboxes',
                        buttonClasses: 'btn btn-default',
                        selectionLimit: 0,
                        closeOnSelect: false,
                        autoUnselect: false,
                        showCheckAll: false,
                        showUncheckAll: false,
                        dynamicTitleMaxItems: 3,
                        maxHeight: '300px',
                    };
                    this.defaultTexts = {
                        checkAll: 'Check all',
                        uncheckAll: 'Uncheck all',
                        checked: 'checked',
                        checkedPlural: 'checked',
                        searchPlaceholder: 'Search...',
                        defaultTitle: 'Select',
                        allSelectedText: 'All Selected'
                    };
                    this.differ = differs.find([]).create(null);
                }
                MultiselectDropdown.prototype.onClick = function (target) {
                    var parentFound = false;
                    while (target != null && !parentFound) {
                        if (target === this.element.nativeElement) {
                            parentFound = true;
                        }
                        target = target.parentElement;
                    }
                    if (!parentFound) {
                        this.isVisible = false;
                    }
                };
                MultiselectDropdown.prototype.ngOnInit = function () {
                    this.settings = Object.assign(this.defaultSettings, this.settings);
                    this.texts = Object.assign(this.defaultTexts, this.texts);
                    this.title = this.texts.defaultTitle;
                };
                MultiselectDropdown.prototype.writeValue = function (value) {
                    if (value !== undefined) {
                        this.model = value;
                    }
                };
                MultiselectDropdown.prototype.registerOnChange = function (fn) {
                    this.onModelChange = fn;
                };
                MultiselectDropdown.prototype.registerOnTouched = function (fn) {
                    this.onModelTouched = fn;
                };
                MultiselectDropdown.prototype.ngDoCheck = function () {
                    var changes = this.differ.diff(this.model);
                    if (changes) {
                        this.updateNumSelected();
                        this.updateTitle();
                    }
                };
                MultiselectDropdown.prototype.clearSearch = function () {
                    this.searchFilterText = '';
                };
                MultiselectDropdown.prototype.toggleDropdown = function () {
                    this.isVisible = !this.isVisible;
                    if (!this.isVisible) {
                        this.dropdownClosed.emit();
                    }
                };
                MultiselectDropdown.prototype.isSelected = function (option) {
                    return this.model && this.model.indexOf(option.id) > -1;
                };
                MultiselectDropdown.prototype.setSelected = function (event, option) {
                    if (!this.model) {
                        this.model = [];
                    }
                    var index = this.model.indexOf(option.id);
                    if (index > -1) {
                        this.model.splice(index, 1);
                    }
                    else {
                        if (this.settings.selectionLimit === 0 || this.model.length < this.settings.selectionLimit) {
                            this.model.push(option.id);
                        }
                        else {
                            if (this.settings.autoUnselect) {
                                this.model.push(option.id);
                                this.model.shift();
                            }
                            else {
                                this.selectionLimitReached.emit(this.model.length);
                                return;
                            }
                        }
                    }
                    if (this.settings.closeOnSelect) {
                        this.toggleDropdown();
                    }
                    this.onModelChange(this.model);
                };
                MultiselectDropdown.prototype.updateNumSelected = function () {
                    this.numSelected = this.model && this.model.length || 0;
                };
                MultiselectDropdown.prototype.updateTitle = function () {
                    var _this = this;
                    if (this.numSelected === 0) {
                        this.title = this.texts.defaultTitle;
                    }
                    else if (this.settings.dynamicTitleMaxItems >= this.numSelected) {
                        this.title = this.options
                            .filter(function (option) { return _this.model && _this.model.indexOf(option.id) > -1; })
                            .map(function (option) { return option.name; })
                            .join(', ');
                    }
                    else {
                        this.title = this.defaultTexts.allSelectedText; //? this.numSelected + ' ' + (this.numSelected === 1 ? this.texts.checked : this.texts.checkedPlural);
                    }
                };
                MultiselectDropdown.prototype.checkAll = function () {
                    this.model = this.options.map(function (option) { return option.id; });
                    this.onModelChange(this.model);
                };
                MultiselectDropdown.prototype.uncheckAll = function () {
                    this.model = [];
                    this.onModelChange(this.model);
                };
                return MultiselectDropdown;
            }());
            __decorate([
                core_1.Input(),
                __metadata("design:type", Array)
            ], MultiselectDropdown.prototype, "options", void 0);
            __decorate([
                core_1.Input(),
                __metadata("design:type", Object)
            ], MultiselectDropdown.prototype, "settings", void 0);
            __decorate([
                core_1.Input(),
                __metadata("design:type", Object)
            ], MultiselectDropdown.prototype, "texts", void 0);
            __decorate([
                core_1.Output(),
                __metadata("design:type", Object)
            ], MultiselectDropdown.prototype, "selectionLimitReached", void 0);
            __decorate([
                core_1.Output(),
                __metadata("design:type", Object)
            ], MultiselectDropdown.prototype, "dropdownClosed", void 0);
            __decorate([
                core_1.HostListener('document: click', ['$event.target']),
                __metadata("design:type", Function),
                __metadata("design:paramtypes", [HTMLElement]),
                __metadata("design:returntype", void 0)
            ], MultiselectDropdown.prototype, "onClick", null);
            MultiselectDropdown = __decorate([
                core_1.Component({
                    selector: 'ss-multiselect-dropdown',
                    providers: [MULTISELECT_VALUE_ACCESSOR],
                    styles: ["\n  a { outline: none !important; }\n  .text-cut {\n      overflow:hidden;\n      display:inline-block;\n      text-overflow: ellipsis;\n      white-space: nowrap;\n      max-width : 150px;\n      vertical-align: bottom;\n  }\n "],
                    template: "\n        <div class=\"btn-group\">\n            <button type=\"button\" class=\"dropdown-toggle\" [ngClass]=\"settings.buttonClasses\" \n            (click)=\"toggleDropdown()\"><span class=\"text-cut\">{{ title }}</span>&nbsp;<span class=\"caret\"></span></button>\n            <ul *ngIf=\"isVisible\" class=\"dropdown-menu\" [class.pull-right]=\"settings.pullRight\" \n            [style.max-height]=\"settings.maxHeight\" style=\"display: block; height: auto; overflow-y: auto;\">\n                <li style=\"margin: 0px 5px 5px 5px;\" *ngIf=\"settings.enableSearch\">\n                    <div class=\"input-group input-group-sm\">\n                        <span class=\"input-group-addon\" id=\"sizing-addon3\"><i class=\"fa fa-search\"></i></span>\n                        <input type=\"text\" class=\"form-control\" placeholder=\"{{ texts.searchPlaceholder }}\" \n                        aria-describedby=\"sizing-addon3\" [(ngModel)]=\"searchFilterText\">\n                        <span class=\"input-group-btn\" *ngIf=\"searchFilterText.length > 0\">\n                            <button class=\"btn btn-default\" type=\"button\" (click)=\"clearSearch()\"><i class=\"fa fa-times\"></i></button>\n                        </span>\n                    </div>\n                </li>\n                <li class=\"divider\" *ngIf=\"settings.enableSearch\"></li>\n                <li *ngIf=\"settings.showCheckAll\">\n                    <a href=\"javascript:;\" role=\"menuitem\" tabindex=\"-1\" (click)=\"checkAll()\">\n                        <span *ngIf=\"settings.checkedStyle == 'glyphicon'\" style=\"width: 16px;\" class=\"glyphicon glyphicon-ok\"></span>\n                        {{ texts.checkAll }}\n                    </a>\n                </li>\n                <li *ngIf=\"settings.showUncheckAll\">\n                    <a href=\"javascript:;\" role=\"menuitem\" tabindex=\"-1\" (click)=\"uncheckAll()\">\n                        <span *ngIf=\"settings.checkedStyle == 'glyphicon'\" style=\"width: 16px;\" class=\"glyphicon glyphicon-remove\"></span>\n                        {{ texts.uncheckAll }}\n                    </a>\n                </li>\n                <li *ngIf=\"settings.showCheckAll || settings.showUncheckAll\" class=\"divider\"></li>\n                <li *ngFor=\"let option of options | searchFilter:searchFilterText\">\n                    <a href=\"javascript:;\" role=\"menuitem\" tabindex=\"-1\" (click)=\"setSelected($event, option)\">\n                        <input *ngIf=\"settings.checkedStyle == 'checkboxes'\" type=\"checkbox\" [checked]=\"isSelected(option)\" />\n                        <span *ngIf=\"settings.checkedStyle == 'glyphicon'\" style=\"width: 16px;\" \n                        class=\"glyphicon\" [class.glyphicon-ok]=\"isSelected(option)\"></span>\n                        {{ option.name }}\n                    </a>\n                </li>\n            </ul>\n        </div>\n    "
                }),
                __metadata("design:paramtypes", [core_1.ElementRef,
                    core_1.IterableDiffers])
            ], MultiselectDropdown);
            exports_1("MultiselectDropdown", MultiselectDropdown);
            MultiselectDropdownModule = (function () {
                function MultiselectDropdownModule() {
                }
                return MultiselectDropdownModule;
            }());
            MultiselectDropdownModule = __decorate([
                core_1.NgModule({
                    imports: [common_1.CommonModule, forms_1.FormsModule],
                    exports: [MultiselectDropdown],
                    declarations: [MultiselectDropdown, MultiSelectSearchFilter],
                }),
                __metadata("design:paramtypes", [])
            ], MultiselectDropdownModule);
            exports_1("MultiselectDropdownModule", MultiselectDropdownModule);
        }
    };
});
//# sourceMappingURL=multiselect-dropdown.js.map