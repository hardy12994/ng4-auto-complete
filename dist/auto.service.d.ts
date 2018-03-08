import { BehaviorSubject } from "rxjs";
export declare class AutoCompleteService {
    list: Array<any>;
    settingDynamicList: BehaviorSubject<boolean>;
    noRecordPlaceHolder: string;
    filterName: string;
    listlength: number;
    wordTrigger: number;
    dataPresent: boolean;
    constructor();
    setDynamicList(list: Array<any>): void;
}
