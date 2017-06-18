export interface IMultiSelectOption {
  id: any;
  name: string;
  isLabel?: boolean;
  parentId?: any;
  params?: any;
}

export interface IMultiSelectSettings {
  pullRight?: boolean;
  enableSearch?: boolean;
  /**
   * 0 - By default
   * If `enableSearch=true` and total amount of items more then `searchRenderLimit` (0 - No limit)
   * then render items only when user typed more then or equal `searchRenderAfter` charachters
   */
  searchRenderLimit?: number;
  /**
   * 3 - By default
   */
  searchRenderAfter?: number;
  checkedStyle?: 'checkboxes' | 'glyphicon' | 'fontawesome';
  buttonClasses?: string;
  itemClasses?: string;
  containerClasses?: string;
  selectionLimit?: number;
  closeOnSelect?: boolean;
  autoUnselect?: boolean;
  showCheckAll?: boolean;
  showUncheckAll?: boolean;
  fixedTitle?: boolean;
  dynamicTitleMaxItems?: number;
  maxHeight?: string;
  displayAllSelectedText?: boolean;
}

export interface IMultiSelectTexts {
  checkAll?: string;
  uncheckAll?: string;
  checked?: string;
  checkedPlural?: string;
  searchPlaceholder?: string;
  saerchEmptyResult?: string;
  searchNoRenderText?: string;
  defaultTitle?: string;
  allSelected?: string;
}
