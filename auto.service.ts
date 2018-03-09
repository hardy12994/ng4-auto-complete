import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";


@Injectable()
export class AutoCompleteService {
    settingDynamicList: BehaviorSubject<boolean>;
    updatingList: BehaviorSubject<boolean>;

    list: Array<any>;
    noRecordPlaceHolder: string;
    filterName: string;
    listlength: number = 15;
    wordTrigger: number;
    dataPresent: boolean = false;

    updatedList: Array<any>;
    updatedListId: string;

    constructor() {
        this.list = [];
        this.settingDynamicList = new BehaviorSubject(false);
        this.updatingList = new BehaviorSubject(false);
    }

    public setDynamicList(list: Array<any>) {

        if (list.length === 0) {
            console.log('dynamic list found empty');
            return;
        }

        this.list = list;
        this.settingDynamicList.next(true);
    }

    public updateList(list: Array<any>, id: any) {

        if (list == undefined || list == null) return;
        this.updatedListId = id;
        this.updatedList = list;
        this.updatingList.next(true);

    }
}