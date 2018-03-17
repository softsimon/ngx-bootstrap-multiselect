import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { MultiselectDropdownModule } from '../../../src';
import { AppComponent } from './app.component';
import { DataService } from './data.service';
import { DummyComponent } from './dummy.component';

@NgModule({
  declarations: [
    AppComponent,
    DummyComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MultiselectDropdownModule,
  ],
  providers: [
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
