(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs'), require('@angular/forms')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', 'rxjs', '@angular/forms'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.autoComplete = {}),global.ng.core,global.rxjs,global.ng.forms));
}(this, (function (exports,core,rxjs,forms) { 'use strict';

var AutoCompleteService = /** @class */ (function () {
    function AutoCompleteService() {
        this.list = [];
        this.settingDynamicList = new rxjs.BehaviorSubject(false);
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
        { type: core.Injectable },
    ];
    /** @nocollapse */
    AutoCompleteService.ctorParameters = function () { return []; };
    return AutoCompleteService;
}());

var AutoCompleteDirective = /** @class */ (function () {
    function AutoCompleteDirective(elemRef, renderer, autoCompleteService, reactiveFormControl) {
        this.elemRef = elemRef;
        this.renderer = renderer;
        this.autoCompleteService = autoCompleteService;
        this.reactiveFormControl = reactiveFormControl;
        this.ngModelChange = new core.EventEmitter(); // for normal model change
        this.valueChanged = new core.EventEmitter(); // for normal value change
        this.listlength = 15;
        this.dropdownInitiated = false;
        this.inpRef = elemRef.nativeElement;
        this.renderer.setAttribute(this.inpRef, "spellcheck", "false");
        this.activateEvents();
    }
    AutoCompleteDirective.prototype.ngOnInit = function () {
        this.configureListType();
        this.configureDirective();
    };
    Object.defineProperty(AutoCompleteDirective.prototype, "autoComplete", {
        set: function (list) {
            this.list = list ? (list.length ? list : []) : [];
            if (this.list.length === 0) {
                console.log('static list found empty');
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AutoCompleteDirective.prototype, "openOnWordLength", {
        set: function (word_trigger) {
            this.wordTrigger = Number(word_trigger);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AutoCompleteDirective.prototype, "listLengthToShow", {
        set: function (listlength) {
            this.listlength = Number(listlength);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AutoCompleteDirective.prototype, "filterIdentity", {
        set: function (filterName) {
            this.filterName = filterName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AutoCompleteDirective.prototype, "noRecordText", {
        set: function (defaultText) {
            this.noRecordPlaceHolder = defaultText;
        },
        enumerable: true,
        configurable: true
    });
    AutoCompleteDirective.prototype.configureListType = function () {
        if (this.list.length && typeof this.list[0] === "object") {
            this.listType = "object";
        }
        if (this.list.length && typeof this.list[0] === "string") {
            this.listType = "string";
        }
    };
    AutoCompleteDirective.prototype.configureDirective = function () {
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
    };
    AutoCompleteDirective.prototype.filterList = function () {
        var that = this;
        var fieldTomatch = new RegExp(that.elemRef.nativeElement["value"], 'ig');
        var data = [];
        if (that.listType === "string") {
            data = that.list.filter(function (item) { return (item.toLowerCase()).match(fieldTomatch); });
        }
        if (that.listType === "object") {
            data = that.list.filter(function (item) { return (item[that.filterName].toLowerCase()).match(fieldTomatch); });
        }
        if (that.listlength) {
            that.listShown = data.slice(0, this.listlength);
        }
        else {
            that.listShown = that.list; //all
        }
        return that.listShown;
    };
    AutoCompleteDirective.prototype.initDropdown = function (list) {
        var _this = this;
        if (list === void 0) { list = undefined; }
        var id = "#" + this.inpRef["id"];
        if (this.noRecordPlaceHolder &&
            list === undefined &&
            this.listShown.length === 1 &&
            this.listShown[0] === this.noRecordPlaceHolder) {
            var that = this;
            var id = "#" + that.inpRef["id"];
            $(id).autocomplete({
                source: function (request, response) {
                    response(that.listShown, function (val) {
                        console.log(val);
                    });
                }
            });
        }
        else {
            if (this.listType === "object") {
                var listData = [];
                this.listShown.forEach(function (item) {
                    listData.push(item[_this.filterName]);
                });
                $(id).autocomplete({
                    source: list != undefined ? list : listData
                });
            }
            else {
                $(id).autocomplete({
                    source: list != undefined ? list : this.listShown
                });
            }
        }
    };
    AutoCompleteDirective.prototype.searchfromList = function (ui) {
        var that = this;
        var toFind = (ui && ui.item) ? ui.item.value : that.elemRef.nativeElement["value"];
        if (that.listType === "string") {
            var data = that.list.find(function (item) { return toFind === item; });
            return data;
        }
        if (that.listType === "object") {
            var data = that.list.find(function (item) { return toFind === item[that.filterName]; });
            return data;
        }
    };
    AutoCompleteDirective.prototype.activateEvents = function () {
        var _this = this;
        var that = this;
        var id = "#" + that.inpRef["id"];
        $(id)
            .on("autocompleteselect", function (event, ui) {
            //for ngmodule                
            if (that.searchfromList(ui)) {
                that.ngModelChange.emit(ui.item.value);
                that.valueChanged.emit(ui.item.value);
            }
            else {
                that.ngModelChange.emit("");
                that.valueChanged.emit("");
            }
            // for Rectiveforms model
            if (that.reactiveFormControl) {
                if (that.searchfromList(ui)) {
                    that.reactiveFormControl.control.setValue(ui.item.value);
                }
                else {
                    that.reactiveFormControl.control.setValue("");
                }
            }
        });
        $(id)
            .on("autocompletechange", function (event, ui) {
            //for ngmodule
            if (that.searchfromList(ui)) {
                that.ngModelChange.emit(that.elemRef.nativeElement["value"]);
                that.valueChanged.emit(that.elemRef.nativeElement["value"]);
            }
            else {
                that.ngModelChange.emit("");
                that.valueChanged.emit("");
            }
            // for Rectiveforms model
            if (that.reactiveFormControl) {
                if (that.searchfromList(ui)) {
                    that.reactiveFormControl.control.setValue(that.elemRef.nativeElement["value"]);
                }
                else {
                    that.reactiveFormControl.control.setValue("");
                }
            }
        });
        rxjs.Observable.fromEvent(this.elemRef.nativeElement, 'keyup')
            .subscribe(function (e) {
            _this.removeOldList();
            if (that.inpRef["value"].length <= (that.wordTrigger - 1)) {
                that.initDropdown([]);
                return;
            }
            that.filterList();
            if (that.noRecordPlaceHolder && !that.listShown.length) {
                _this.listShown = [that.noRecordPlaceHolder];
                that.initDropdown();
                return;
            }
            that.initDropdown();
        });
        this.autoCompleteService.settingDynamicList
            .subscribe(function (bool) {
            if (bool) {
                _this.list = _this.autoCompleteService.list;
                _this.restartDirective();
            }
        });
    };
    AutoCompleteDirective.prototype.restartDirective = function () {
        this.configureListType();
        this.configureDirective();
    };
    AutoCompleteDirective.prototype.removeOldList = function () {
        this.initDropdown([]);
    };
    AutoCompleteDirective.decorators = [
        { type: core.Directive, args: [{
                    selector: '[ng4-auto-complete]'
                },] },
    ];
    /** @nocollapse */
    AutoCompleteDirective.ctorParameters = function () { return [
        { type: core.ElementRef, },
        { type: core.Renderer2, },
        { type: AutoCompleteService, },
        { type: forms.NgControl, decorators: [{ type: core.Optional },] },
    ]; };
    AutoCompleteDirective.propDecorators = {
        'ngModelChange': [{ type: core.Output },],
        'valueChanged': [{ type: core.Output },],
        'autoComplete': [{ type: core.Input, args: ['ng4-auto-complete',] },],
        'openOnWordLength': [{ type: core.Input, args: ['word-trigger',] },],
        'listLengthToShow': [{ type: core.Input, args: ['list-length',] },],
        'filterIdentity': [{ type: core.Input, args: ['filterName',] },],
        'noRecordText': [{ type: core.Input, args: ['no-record-text',] },],
    };
    return AutoCompleteDirective;
}());

var AutoCompleteModule = /** @class */ (function () {
    function AutoCompleteModule() {
    }
    AutoCompleteModule.decorators = [
        { type: core.NgModule, args: [{
                    declarations: [AutoCompleteDirective],
                    exports: [AutoCompleteDirective],
                    providers: [AutoCompleteService]
                },] },
    ];
    /** @nocollapse */
    AutoCompleteModule.ctorParameters = function () { return []; };
    return AutoCompleteModule;
}());

exports.AutoCompleteModule = AutoCompleteModule;
exports.AutoCompleteService = AutoCompleteService;

Object.defineProperty(exports, '__esModule', { value: true });

})));
