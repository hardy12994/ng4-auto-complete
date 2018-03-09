import {
    Directive,
    ElementRef,
    Input,
    Renderer2,
    OnInit,
    EventEmitter,
    Output,
    Optional
} from "@angular/core";
import { Observable } from "rxjs";
import { NgControl } from "@angular/forms";
import { AutoCompleteService } from "./auto.service";

declare const $: any;

@Directive({
    selector: '[ng4-auto-complete]'
})

export class AutoCompleteDirective implements OnInit {
    @Output() ngModelChange = new EventEmitter(); // for normal model change
    @Output() valueChanged = new EventEmitter();  // for normal value change
    noRecordPlaceHolder: string;
    filterName: string;
    listlength: number = 15;
    listType: string;
    list: Array<any>;
    wordTrigger: number;
    listShown: any;
    inpRef: any;
    dropdownInitiated = false;

    constructor(public elemRef: ElementRef,
        public renderer: Renderer2,
        public autoCompleteService: AutoCompleteService,
        @Optional() public reactiveFormControl: NgControl
    ) {
        this.inpRef = elemRef.nativeElement;
        this.renderer.setAttribute(this.inpRef, "spellcheck", "false");
        this.getDataFromService();
        this.activateEvents();
    }

    ngOnInit() {
        this.configureListType();
        this.configureDirective();
    }

    getDataFromService() {
        if (this.autoCompleteService.dataPresent) {
            this.list = this.autoCompleteService.list;
            this.wordTrigger = this.autoCompleteService.wordTrigger;
            this.listlength = this.autoCompleteService.listlength;
            this.filterName = this.autoCompleteService.filterName;
            this.noRecordPlaceHolder = this.autoCompleteService.noRecordPlaceHolder;
        }
    }

    @Input('ng4-auto-complete') set autoComplete(list: any) {
        this.list = list ? (list.length ? list : []) : [];

        if (this.list.length === 0) {
            console.log('static list found empty');
        }

        if (list != undefined || list != null) {
            this.autoCompleteService.list = list;
            this.autoCompleteService.dataPresent = true;

        } else {
            this.list = this.autoCompleteService.list;
        }
    }

    @Input('word-trigger') set openOnWordLength(word_trigger: number) {
        this.wordTrigger = Number(word_trigger);
        this.autoCompleteService.wordTrigger = this.wordTrigger;

        if (word_trigger != undefined || word_trigger != null) {
            this.autoCompleteService.wordTrigger = Number(word_trigger);
            this.autoCompleteService.dataPresent = true;

        } else {
            this.wordTrigger = this.autoCompleteService.wordTrigger;
        }
    }

    @Input('list-length') set listLengthToShow(listlength: number) {
        this.listlength = Number(listlength);

        if (listlength != undefined || listlength != null) {
            this.autoCompleteService.listlength = Number(listlength);
            this.autoCompleteService.dataPresent = true;

        } else {
            this.listlength = this.autoCompleteService.listlength;
        }
    }

    @Input('filterName') set filterIdentity(filterName: string) {
        this.filterName = filterName;

        if (filterName != undefined || filterName != null) {
            this.autoCompleteService.filterName = filterName;
            this.autoCompleteService.dataPresent = true;

        } else {
            this.filterName = this.autoCompleteService.filterName;
        }
    }

    @Input('no-record-text') set noRecordText(defaultText: string) {
        this.noRecordPlaceHolder = defaultText;

        if (defaultText != undefined || defaultText != null) {
            this.autoCompleteService.noRecordPlaceHolder = defaultText;
            this.autoCompleteService.dataPresent = true;

        } else {
            this.noRecordPlaceHolder = this.autoCompleteService.noRecordPlaceHolder;
        }
    }


    configureListType() {

        if (this.list.length && typeof this.list[0] === "object") {
            this.listType = "object"
        }

        if (this.list.length && typeof this.list[0] === "string") {
            this.listType = "string"
        }
    }

    configureDirective() {
        if (!this.inpRef["id"]) {
            throw "auto-directive ID Required! Please provide the unique directive id";
        }

        if (this.listType === "object" && !this.filterName) {
            throw "Object List Found! Please provide filterName to pluck from object";
        }

        if (this.wordTrigger) {
            this.listShown = [];
            return;
        }

        // initiated coz- after one leter it helps to open
        this.filterList();
        this.initDropdown();
    }

    filterList() {
        var that = this;
        var fieldTomatch = new RegExp(that.elemRef.nativeElement["value"], 'ig');
        var data = [];

        if (that.listType === "string") {
            data = that.list.filter((item: any) => (item.toLowerCase()).match(fieldTomatch));
        }

        if (that.listType === "object") {
            data = that.list.filter((item: any) => (item[that.filterName].toLowerCase()).match(fieldTomatch));
        }

        if (that.listlength) {
            that.listShown = data.slice(0, this.listlength);
        } else {
            that.listShown = that.list; //all
        }

        return that.listShown;
    }


    autoCompleteSelect(event: any, ui: any) {
        var that = this;
        let dataFromList = that.searchfromList(ui);
        let id = `#${event.target.id}`

        //for ngmodule
        if (dataFromList) {
            that.ngModelChange.emit(ui.item.value);
            that.valueChanged.emit(ui.item.value);
        } else {
            that.ngModelChange.emit("");
            that.valueChanged.emit("");
            setTimeout(() => {
                $(id).val("");
            }, 0);
        }

        // for Rectiveforms model
        if (that.reactiveFormControl) {
            if (dataFromList) {
                that.reactiveFormControl.control.setValue(ui.item.value);
            } else {
                that.reactiveFormControl.control.setValue("");
            }
        }



    }

    autoCompleteChange(event: any, ui: any) {

        var that = this;
        let dataFromList = that.searchfromList(ui);
        let id = `#${event.target.id}`;

        //for ngmodule
        if (dataFromList) {
            that.ngModelChange.emit(that.elemRef.nativeElement["value"]);
            that.valueChanged.emit(that.elemRef.nativeElement["value"]);

        } else {
            that.ngModelChange.emit("");
            that.valueChanged.emit("");
            setTimeout(() => {
                $(id).val("");
            }, 0);
        }

        // for Rectiveforms model
        if (that.reactiveFormControl) {
            if (dataFromList) {
                that.reactiveFormControl.control.setValue(that.elemRef.nativeElement["value"]);
            } else {
                that.reactiveFormControl.control.setValue("");
            }
        }

    }

    initDropdown(list: any = undefined, updatedListId: any = null) {

        var id = updatedListId || `#${this.inpRef["id"]}`;

        if (this.noRecordPlaceHolder &&
            list === undefined &&
            this.listShown.length === 1 &&
            this.listShown[0] === this.noRecordPlaceHolder) {

            var that = this;

            $(id).autocomplete({
                // disabled: true,
                source: function (request: any, response: any) {
                    var matcher = new RegExp(that.noRecordPlaceHolder, "i");
                    response(that.listShown, function (val: any) {
                        console.log(val);
                    });
                }
            })

        } else {
            if (this.listType === "object") {

                var listData: any = [];
                this.listShown.forEach((item: any) => {
                    listData.push(item[this.filterName])
                });

                $(id).autocomplete({
                    source: list != undefined ? list : listData,
                    change: (event: any, ui: any) => {
                        this.autoCompleteChange(event, ui);
                    },
                    select: (event: any, ui: any) => {
                        this.autoCompleteSelect(event, ui);
                    }
                });

            } else {
                $(id).autocomplete({
                    source: list != undefined ? list : this.listShown,
                    change: (event: any, ui: any) => {
                        this.autoCompleteChange(event, ui);
                    },
                    select: (event: any, ui: any) => {
                        this.autoCompleteSelect(event, ui);
                    }
                });
            }

        }

    }

    searchfromList(ui: any) {
        var that = this;

        var toFind = (ui && ui.item) ? ui.item.value : that.elemRef.nativeElement["value"];
        if (that.listType === "string") {
            var data = that.list.find(item => toFind === item);
            return data;
        }

        if (that.listType === "object") {
            var data = that.list.find(item => toFind === item[that.filterName]);
            return data;
        }
    }

    activateEvents() {
        var that = this;
        // var id = `#${that.inpRef["id"]}`;

        // $("#city")
        //     .on("autocompleteselect", function (event: any, ui: any) {

        //         //for ngmodule                
        //         if (that.searchfromList(ui)) {
        //             that.ngModelChange.emit(ui.item.value);
        //             that.valueChanged.emit(ui.item.value);
        //         } else {
        //             that.ngModelChange.emit("");
        //             that.valueChanged.emit("");
        //         }

        //         // for Rectiveforms model
        //         if (that.reactiveFormControl) {
        //             if (that.searchfromList(ui)) {
        //                 that.reactiveFormControl.control.setValue(ui.item.value);
        //             } else {
        //                 that.reactiveFormControl.control.setValue("");
        //             }
        //         }

        //     });

        // $("#city")
        //     .on("autocompletechange", function (event: any, ui: any) {

        //         //for ngmodule
        //         if (that.searchfromList(ui)) {
        //             that.ngModelChange.emit(that.elemRef.nativeElement["value"]);
        //             that.valueChanged.emit(that.elemRef.nativeElement["value"]);

        //         } else {
        //             that.ngModelChange.emit("");
        //             that.valueChanged.emit("");
        //         }

        //         // for Rectiveforms model
        //         if (that.reactiveFormControl) {
        //             if (that.searchfromList(ui)) {
        //                 that.reactiveFormControl.control.setValue(that.elemRef.nativeElement["value"]);
        //             } else {
        //                 that.reactiveFormControl.control.setValue("");
        //             }
        //         }

        //     });

        Observable.fromEvent(this.elemRef.nativeElement, 'keyup')
            .subscribe((e: any) => {

                this.removeOldList();

                if (that.inpRef["value"].length <= (that.wordTrigger - 1)) {
                    that.initDropdown([]);
                    return;
                }

                that.filterList();

                if (that.noRecordPlaceHolder && !that.listShown.length) {
                    this.listShown = [that.noRecordPlaceHolder];
                    that.initDropdown();
                    return;

                }
                that.initDropdown();
            });

        this.autoCompleteService.settingDynamicList
            .subscribe(bool => {
                if (bool) {
                    this.list = this.autoCompleteService.list;
                    this.restartDirective();
                }
            });

        this.autoCompleteService.updatingList
            .subscribe(bool => {
                if (bool) {
                    var updatedList = this.autoCompleteService.updatedList;
                    var updatedListId = this.autoCompleteService.updatedListId;
                    this.initDropdown(updatedList, updatedListId);
                }
            });

    }

    restartDirective() {
        this.configureListType();
        this.configureDirective();
    }

    removeOldList() {
        this.initDropdown([]);
    }
}