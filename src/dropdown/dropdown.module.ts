import { MultiselectDropdown } from './dropdown.component';
import { MultiSelectSearchFilter } from './search-filter.pipe';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  exports: [MultiselectDropdown, MultiSelectSearchFilter],
  declarations: [MultiselectDropdown, MultiSelectSearchFilter],
})
export class MultiselectDropdownModule { }
