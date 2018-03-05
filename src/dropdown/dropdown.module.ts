import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AutofocusDirective } from './autofocus.directive';
import { MultiselectDropdown } from './dropdown.component';
import { MultiSelectSearchFilter } from './search-filter.pipe';

@NgModule({
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
})
export class MultiselectDropdownModule { }
