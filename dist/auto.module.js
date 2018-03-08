import { AutoCompleteDirective } from "./auto.directive";
import { AutoCompleteService } from "./auto.service";
import { NgModule } from "@angular/core";
var AutoCompleteModule = /** @class */ (function () {
    function AutoCompleteModule() {
    }
    AutoCompleteModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [AutoCompleteDirective],
                    exports: [AutoCompleteDirective],
                    providers: [AutoCompleteService]
                },] },
    ];
    /** @nocollapse */
    AutoCompleteModule.ctorParameters = function () { return []; };
    return AutoCompleteModule;
}());
export { AutoCompleteModule };
//# sourceMappingURL=auto.module.js.map