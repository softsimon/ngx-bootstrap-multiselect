import { Directive, ElementRef, Host, Input } from '@angular/core';
var AutofocusDirective = /** @class */ (function () {
    function AutofocusDirective(elemRef) {
        this.elemRef = elemRef;
    }
    Object.defineProperty(AutofocusDirective.prototype, "element", {
        get: function () {
            return this.elemRef.nativeElement;
        },
        enumerable: true,
        configurable: true
    });
    AutofocusDirective.prototype.ngOnInit = function () {
        this.focus();
    };
    AutofocusDirective.prototype.ngOnChanges = function (changes) {
        var ssAutofocusChange = changes.ssAutofocus;
        if (ssAutofocusChange && !ssAutofocusChange.isFirstChange()) {
            this.focus();
        }
    };
    AutofocusDirective.prototype.focus = function () {
        if (this.ssAutofocus) {
            return;
        }
        this.element.focus && this.element.focus();
    };
    AutofocusDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[ssAutofocus]'
                },] },
    ];
    /** @nocollapse */
    AutofocusDirective.ctorParameters = function () { return [
        { type: ElementRef, decorators: [{ type: Host },] },
    ]; };
    AutofocusDirective.propDecorators = {
        'ssAutofocus': [{ type: Input },],
    };
    return AutofocusDirective;
}());
export { AutofocusDirective };
//# sourceMappingURL=autofocus.directive.js.map