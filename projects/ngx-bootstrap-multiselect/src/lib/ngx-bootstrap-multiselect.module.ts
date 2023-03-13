import { NgModule } from '@angular/core';
import { NgxDropdownMultiselectComponent } from './ngx-bootstrap-multiselect.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MultiSelectSearchFilter } from './search-filter.pipe';
import { AutofocusDirective } from './autofocus.directive';
import { OffClickDirective } from './off-click.directive';

@NgModule({
  declarations: [
    NgxDropdownMultiselectComponent,
    MultiSelectSearchFilter,
    AutofocusDirective,
    OffClickDirective
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    NgxDropdownMultiselectComponent,
    MultiSelectSearchFilter,
  ],
})
export class NgxBootstrapMultiselectModule { }
