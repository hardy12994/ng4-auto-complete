import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";


@Injectable()
export class AutoCompleteService {
    list: Array<any>;
    settingDynamicList: BehaviorSubject<boolean>;


    noRecordPlaceHolder: string;
    filterName: string;
    listlength: number = 15;
    wordTrigger: number;
    dataPresent: boolean = false;


    constructor() {
        this.list = [];
        this.settingDynamicList = new BehaviorSubject(false);
    }

    public setDynamicList(list: Array<any>) {

        if (list.length === 0) {
            console.log('dynamic list found empty');
            return;
        }

        this.list = list;
        this.settingDynamicList.next(true);
    }
}