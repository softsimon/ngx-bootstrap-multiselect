import {Component} from 'angular2/core';
import {MultiselectDropdown, IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts} from './multiselect-dropdown';

@Component({
    selector: 'my-app',
    template: `
		<div>
			<h2>Default</h2>
			<ss-multiselect-dropdown [options]="countries"></ss-multiselect-dropdown>

			<h2>Glyphicons and check all/none</h2>
			<ss-multiselect-dropdown [options]="countries" [settings]="selectSettings" [texts]="texts"></ss-multiselect-dropdown>

			<h2>Search filter</h2>
			<ss-multiselect-dropdown [options]="countries" [settings]="selectSettings2" [texts]="texts"></ss-multiselect-dropdown>

			<h2>Default model, selection limit and no dynamic title</h2>
			<ss-multiselect-dropdown [options]="countries" [defaultModel]="selectedCountries" [settings]="selectSettings3" [texts]="texts"></ss-multiselect-dropdown>

	    </div>
	`,
	directives: [MultiselectDropdown],
	providers: []
})
export class AppComponent {

	private selectedCountries: number[] = [1, 2];

	private countries: IMultiSelectOption[] = [
		{ id: 1, name: 'Sweden' },
		{ id: 2, name: 'Norway' },
		{ id: 3, name: 'Denmark' },
		{ id: 4, name: 'Finland' },
	];

	private texts: IMultiSelectTexts = {
		defaultTitle: 'Select countries'
	};

	private selectSettings: IMultiSelectSettings = {
		checkedStyle: 'glyphicon',
		showCheckAll: true,
		showUncheckAll: true,
	};

	private selectSettings2: IMultiSelectSettings = {
		enableSearch: true,
	};

	private selectSettings3: IMultiSelectSettings = {
		selectionLimit: 3,
		dynamicTitleMaxItems: 0,
	};
}
