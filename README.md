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
### Settings ####
| Setting              | Description                                                        | Default Value     |
| -------------------- | ------------------------------------------------------------------ | ----------------  |
| pullRight            | Float the dropdown to the right                    | false             |
| enableSearch         | Enable searching the dropdown items                                | false             |
| checkedStyle         | Style of checked items one of 'checkboxes', 'glyphicon' or 'none'  | 'checkboxes'      |
| buttonClasses        | CSS classes to apply to buttons                                    | 'btn btn-default' |
| selectionLimit       | Maximum number of items that may be selected (0 = no limit)        | 0                 |
| autoUnselect         | Unselect the previous selection(s) once selectionLimit is reached  | false             |
| closeOnSelect        | If enabled, dropdown will be closed after selection                | false             |
| showCheckAll         | Display the check all item to select all options                   | false             |
| showUncheckAll       | Display the uncheck all item to unselect all options               | false             |
| dynamicTitleMaxItems | The maximum number of options to display in the dynamic title      | 3                 |
| maxHeight            | The maximum height for the dropdown                                | '300px'           |

### Single select ###
Although this dropdown is designed for multiple selections, a common request is to only allow a single selection without requiring the user to unselect their previous selection each time. This can be accomplished by setting selectionLimit to 1 and autoUnselect to true.
```
{
  ...
  selectionLimit: 1,
  autoUnselect: true,
  ...
}
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
