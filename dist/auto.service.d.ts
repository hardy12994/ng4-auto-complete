import { BehaviorSubject } from "rxjs";
export declare class AutoCompleteService {
    settingDynamicList: BehaviorSubject<boolean>;
    updatingList: BehaviorSubject<boolean>;
    list: Array<any>;
    noRecordPlaceHolder: string;
    filterName: string;
    listlength: number;
    wordTrigger: number;
    dataPresent: boolean;
    updatedList: Array<any>;
    updatedListId: string;
    constructor();
    setDynamicList(list: Array<any>): void;
    updateList(list: Array<any>, id: any): void;
}
