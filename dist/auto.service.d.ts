import { BehaviorSubject } from "rxjs";
export declare class AutoCompleteService {
    list: Array<any>;
    settingDynamicList: BehaviorSubject<boolean>;
    constructor();
    setDynamicList(list: Array<any>): void;
}
