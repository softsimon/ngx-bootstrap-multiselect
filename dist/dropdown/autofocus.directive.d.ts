import { ElementRef, OnChanges, OnInit, SimpleChanges } from '@angular/core';
export declare class AutofocusDirective implements OnInit, OnChanges {
    private elemRef;
    /**
     * Will set focus if set to falsy value or not set at all
     */
    ssAutofocus: boolean;
    readonly element: {
        focus?: Function;
    };
    constructor(elemRef: ElementRef);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    focus(): void;
}
