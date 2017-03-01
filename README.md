# Angular 2 Dropdown Multiselect for Bootstrap CSS

Works with Angular Final and AOT compilation

Customizable dropdown multiselect in Angular 2, TypeScript with bootstrap css.

See demo: http://softsimon.github.io/angular-2-dropdown-multiselect

## Dependencies
* Bootstrap CSS 3
* Font Awesome *(only with search box and checkbox mode)*

## Quick start options

* [Download the latest release](https://github.com/softsimon/angular-2-dropdown-multiselect/releases).
* Clone the repo: `git clone https://github.com/softsimon/angular-2-dropdown-multiselect.git`.
* Install with [Bower](http://bower.io): `bower install angular-2-dropdown-multiselect --save`.
* Install with [npm](https://www.npmjs.com): `npm install angular-2-dropdown-multiselect --save-dev`.

## Usage

Import `MultiselectDropdown` into your @NgModule.

```js
import {MultiselectDropdownModule} from 'angular-2-dropdown-multiselect/src/multiselect-dropdown';

// ...

@NgModule({
  // ...
  imports: [
    MultiselectDropdownModule,
    // ...
  ]
})
```

Define options in your consuming component:

```js
import {IMultiSelectOption} from 'angular-2-dropdown-multiselect/src/multiselect-dropdown';

export class MyClass {
    private selectedOptions: number[];
    private myOptions: IMultiSelectOption[] = [
        { id: 1, name: 'Option 1' },
        { id: 2, name: 'Option 2' },
    ];
}
```

In your template, use the component directive:

```html
<ss-multiselect-dropdown [options]="myOptions" [(ngModel)]="selectedOptions" (ngModelChange)="onChange($event)"></ss-multiselect-dropdown>
```

## Customize

Import the IMultiSelectSettings and IMultiSelectTexts interfaces to enable/override settings and text strings:
```js
private selectedOptions: number[] = [1, 2]; // Default selection

private mySettings: IMultiSelectSettings = {
    pullRight: false,
    enableSearch: false,
    checkedStyle: 'checkboxes',
    buttonClasses: 'btn btn-default',
    selectionLimit: 0,
    autoUnselect: false,
    closeOnSelect: false,
    showCheckAll: false,
    showUncheckAll: false,
    dynamicTitleMaxItems: 3,
    maxHeight: '300px',
};

private myTexts: IMultiSelectTexts = {
    checkAll: 'Check all',
    uncheckAll: 'Uncheck all',
    checked: 'checked',
    checkedPlural: 'checked',
    searchPlaceholder: 'Search...',
    defaultTitle: 'Select',
};
```

```html
<ss-multiselect-dropdown [options]="mySettings" [texts]="myTexts" [settings]="mySettings" [(ngModel)]="selectedOptions">
</ss-multiselect-dropdown>
```

### Settings ####
| Setting              | Description                                                        | Default Value     |
| -------------------- | ------------------------------------------------------------------ | ----------------  |
| pullRight            | Display the dropdown with a right-aligned style                    | false             |
| enableSearch         | Enable searching the dropdown items                                | false             |
| checkedStyle         | Style of items when "checking"                                     | 'checkboxes'      |
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

## Developing

Pull requests are welcome!

## License

[MIT]
