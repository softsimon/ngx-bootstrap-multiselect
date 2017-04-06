# AngularX Dropdown Multiselect for Bootstrap CSS

Works with Angular Final and AOT compilation

Customizable dropdown multiselect in AngularX, TypeScript with bootstrap css.

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
    buttonClasses: 'btn btn-default btn-secondary',
    selectionLimit: 0,
    closeOnSelect: false,
    autoUnselect: false,
    showCheckAll: false,
    showUncheckAll: false,
    fixedTitle: false,
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
    allSelected: 'All selected',
};

/* Labels */
myOptions: IMultiSelectOption[] = [
    { id: 1, name: 'Car brands', isLabel: true },
    { id: 2, name: 'Volvo', parentId: 1 },
    { id: 3, name: 'Colors', isLabel: true },
    { id: 4, name: 'Blue', parentId: 3 }
];

```

```html
<ss-multiselect-dropdown [options]="myOptions" [texts]="myTexts" [settings]="mySettings" [(ngModel)]="optionsModel"></ss-multiselect-dropdown>
```

## Use model driven forms with ReactiveFormsModule:

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
            optionsModel: [1, 2], // Default model
        });

        this.myForm.controls['optionsModel'].valueChanges
            .subscribe((selectedOptions) => {
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
