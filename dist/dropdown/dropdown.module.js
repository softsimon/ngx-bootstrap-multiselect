import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AutofocusDirective } from './autofocus.directive';
import { MultiselectDropdown } from './dropdown.component';
import { MultiSelectSearchFilter } from './search-filter.pipe';
var MultiselectDropdownModule = /** @class */ (function () {
    function MultiselectDropdownModule() {
    }
    MultiselectDropdownModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule, ReactiveFormsModule],
                    exports: [
                        MultiselectDropdown,
                        MultiSelectSearchFilter,
                    ],
                    declarations: [
                        MultiselectDropdown,
                        MultiSelectSearchFilter,
                        AutofocusDirective,
                    ],
                },] },
    ];
    /** @nocollapse */
    MultiselectDropdownModule.ctorParameters = function () { return []; };
    return MultiselectDropdownModule;
}());
export { MultiselectDropdownModule };
//# sourceMappingURL=dropdown.module.js.map