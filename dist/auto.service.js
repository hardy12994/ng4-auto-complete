import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
var AutoCompleteService = /** @class */ (function () {
    function AutoCompleteService() {
        this.listlength = 15;
        this.dataPresent = false;
        this.list = [];
        this.settingDynamicList = new BehaviorSubject(false);
    }
    AutoCompleteService.prototype.setDynamicList = function (list) {
        if (list.length === 0) {
            console.log('dynamic list found empty');
            return;
        }
        this.list = list;
        this.settingDynamicList.next(true);
    };
    AutoCompleteService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    AutoCompleteService.ctorParameters = function () { return []; };
    return AutoCompleteService;
}());
export { AutoCompleteService };
//# sourceMappingURL=auto.service.js.map