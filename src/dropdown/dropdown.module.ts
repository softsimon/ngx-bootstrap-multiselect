import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AutofocusDirective } from './autofocus.directive';
import { MultiselectDropdownComponent } from './dropdown.component';
import { MultiSelectSearchFilter } from './search-filter.pipe';
import { OffClickDirective } from './off-click.directive';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  exports: [
    MultiselectDropdownComponent,
    MultiSelectSearchFilter,
  ],
  declarations: [
    MultiselectDropdownComponent,
    MultiSelectSearchFilter,
    AutofocusDirective,
    OffClickDirective
  ],
})
export class MultiselectDropdownModule { }
