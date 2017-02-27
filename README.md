# Angular 2 Dropdown Multiselect for Bootstrap CSS

Works with Angular Final and AOT compilation

Customizable dropdown multiselect in Angular 2, TypeScript with bootstrap css.

See demo: http://softsimon.github.io/angular-2-dropdown-multiselect

## Dependencies
* Bootstrap CSS 3 or 4
* Font Awesome (optional)

## Quick start options

* [Download the latest release](https://github.com/softsimon/angular-2-dropdown-multiselect/releases).
* Clone the repo: `git clone https://github.com/softsimon/angular-2-dropdown-multiselect.git`.
* Install with [Bower](http://bower.io): `bower install angular-2-dropdown-multiselect --save`.
* Install with [npm](https://www.npmjs.com): `npm install angular-2-dropdown-multiselect --save-dev`.

## Usage

Import `MultiselectDropdown` into your @NgModule.

```js
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';

@NgModule({
  // ...
  imports: [
    MultiselectDropdownModule,
  ]
  // ...
})
```

Define options in your consuming component:

```js
import { IMultiSelectOption } from 'angular-2-dropdown-multiselect';

export class MyClass implements OnInit {
    optionsModel: number[];
    ngOnInit() {
        myOptions: IMultiSelectOption[] = [
            { id: 1, name: 'Option 1' },
            { id: 2, name: 'Option 2' },
        ];
    }
    onChange() {
        console.log(this.optionsModel);
    }
}
```

In your template, use the component directive:

```html
<ss-multiselect-dropdown [options]="myOptions" [(ngModel)]="optionsModel" (ngModelChange)="onChange($event)"></ss-multiselect-dropdown>
```

## Customize

Import the IMultiSelectOption and IMultiSelectTexts interfaces to enable/override settings and text strings:
```js
optionsModel: number[] = [1, 2]; // Default selection

mySettings: IMultiSelectSettings = {
    pullRight: false,
    enableSearch: false,
    checkedStyle: 'checkboxes',
    buttonClasses: 'btn btn-default',
    selectionLimit: 0,
    closeOnSelect: false,
    showCheckAll: false,
    showUncheckAll: false,
    dynamicTitleMaxItems: 3,
    maxHeight: '300px',
};

myTexts: IMultiSelectTexts = {
    checkAll: 'Check all',
    uncheckAll: 'Uncheck all',
    checked: 'checked',
    checkedPlural: 'checked',
    searchPlaceholder: 'Search...',
    defaultTitle: 'Select',
};
```

```html
<ss-multiselect-dropdown [options]="myOptions" [texts]="myTexts" [settings]="mySettings" [(ngModel)]="optionsModel"></ss-multiselect-dropdown>
```

Use model driven forms with ReactiveFormsModule:

```js
import { IMultiSelectOption } from 'angular-2-dropdown-multiselect';

export class MyClass implements OnInit {
    model: number[];
    myOptions: IMultiSelectOption[] = [
        { id: 1, name: 'Option 1' },
        { id: 2, name: 'Option 2' },
    ];

    ngOnInit() {
        this.myForm = this.formBuilder.group({
            optionsModel: [1, 2],
        });

        this.myForm.controls['optionsModel'].valueChanges
            .subscribe((values) => {
                // changes
            });
    }
}
```

```html
<form [formGroup]="myForm">
    <ss-multiselect-dropdown [options]="myOptions" formControlName="optionsModel"></ss-multiselect-dropdown>
</form>
```

## Developing

Pull requests are welcome!

## License

[MIT]
