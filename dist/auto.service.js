import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
var AutoCompleteService = /** @class */ (function () {
    function AutoCompleteService() {
        this.listlength = 15;
        this.dataPresent = false;
        this.list = [];
        this.settingDynamicList = new BehaviorSubject(false);
        this.updatingList = new BehaviorSubject(false);
    }
    AutoCompleteService.prototype.setDynamicList = function (list) {
        if (list.length === 0) {
            console.log('dynamic list found empty');
            return;
        }
        this.list = list;
        this.settingDynamicList.next(true);
    };
    AutoCompleteService.prototype.updateList = function (list, id) {
        if (list == undefined || list == null)
            return;
        this.updatedListId = id;
        this.updatedList = list;
        this.updatingList.next(true);
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