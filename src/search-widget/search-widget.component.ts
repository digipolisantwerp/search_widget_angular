import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnChanges,
    OnInit,
    SimpleChanges,
    ViewChild,
    ContentChild,
    TemplateRef,
    forwardRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import * as get_ from 'lodash.get';
const get = get_;
import * as isequal_ from 'lodash.isequal';
const isequal = isequal_;

import { FlyoutDirective } from '@acpaas-ui/flyout';
import { FlyoutZoneDirective } from '@acpaas-ui/flyout';
import { SearchWidgetService } from './search-widget.service';
import { Observer, Observable } from 'rxjs';

@Component({
    selector: 'aui-search',
    styleUrls: [
        './search-widget.component.scss'
    ],
    templateUrl: './search-widget.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SearchWidgetComponent), // tslint:disable-line
            multi: true
        }
    ]
})

export class SearchWidgetComponent implements ControlValueAccessor, OnInit, OnChanges {
    @Input() public url;
    @Input() public id: string;
    @Input() public placeholder: string = "Search..";
    @Input() public results: any[] = []; // The values for the selectable list
    @Input() public data: any[] = []; // The values to search in when remote search is disabled
    @Input() public remote = false; // Disable or enamble remote search
    @Input() public minCharacters = 0;
    @Input() public mask: string = null;
    @Input() public clearInvalid = false;
    @Input() public searchIncentiveText: string;
    @Input() public loadingText: string;
    @Input() public noResultsText: string;
    @Input() public showAllByDefault = false;

    // specify which label/value props to use
    @Input() label: string;
    @Input() value: string;

    // Eventemitter for searchvalue (parent object should update the results with this param)
    @Output() search: EventEmitter<string> = new EventEmitter();
    @Output() select: EventEmitter<any> = new EventEmitter();

    @ViewChild(FlyoutDirective) flyout: FlyoutDirective;
    @ViewChild(FlyoutZoneDirective) flyoutZone: FlyoutZoneDirective;

    @ContentChild(TemplateRef) public template: TemplateRef<any>;

    public query = '';
    public index = -1; // index for active element in selectable list, by default -1 (so it starts in the input field)
    public selectedItem: any = null; // keep a backup of the selectedItem
    public searching = false; // track remote search state
    public focused = false;
    public align = 'top';
    public text = '';
    private searchChange$: Observer<string>;


    private remoteValue = false;

    public updateModel = (_: any) => { };

    constructor(
        private searchWidgetService: SearchWidgetService
    ) {

     }

    // CONTROL_VALUE_ACCESSOR interface
    public writeValue(value = '') {

        if (this.value && this.results) {
            const selected = this.results.find((item: any) => item[this.value] === value);
            if (selected) {
                return this.query = selected[this.label];
            }

            if (this.remote && !!value) {
                this.remoteValue = true;
            }
        }

        this.query = this.value;
    }

    // CONTROL_VALUE_ACCESSOR interface
    public registerOnChange(fn) {
        this.updateModel = fn;
    }

    // CONTROL_VALUE_ACCESSOR interface
    public registerOnTouched() {}

    public ngOnInit(): void {
        if(this.remote){
            if(this.value){
                this.query = this.value;
            }
            Observable.create((observer) => {
                this.searchChange$ = observer;
            }).debounceTime(300)
                .mergeMap((search) => this.searchWidgetService.getSearchWidgetResults(this.url, this.query))
                .subscribe((results) => {
                    this.results = results.terms;
                });
        }else{
            if ((Array.isArray(this.data) && this.data.length > 0) && !this.query && this.showAllByDefault) {
                this.results = [...this.data];
            }
        }

        this.writeValue();
    }

    // OnChanges interface
    public ngOnChanges(changes: SimpleChanges): void {

        if (!changes) {
            return;
        }

        const newData = get(changes, 'data.currentValue', []);
        if (!isequal(newData, get(changes, 'data.previousValue', []))) {
            if (this.remote) {
                this.remoteSearch();
            } else {
                this.localSearch();
            }
        }

        if (changes.results && changes.results.currentValue) {
            this.searching = false;
        }
    }

    public propagateChange(query: string) {
        if(this.results){
            const item = this.results.find(res => this.label ? res[this.label] === query : res === query);
            this.query = query;
            
            if (!item) {
                this.select.emit(this.query);
                return;
            }else{
                this.select.emit(item);
            }
    
            const key = this.value ? this.value : this.label ? this.label : null;
            this.updateModel(key ? item[key] || '' : item);
            this.selectedItem = item;
        }
    }

    /**
     * triggers on input value change
     */
    public doSearch(): void {
        if(this.minCharacters < this.query.length){
            this.index = -1; // reset index
            this.searching = true;
    
            if (this.remote) {
                this.searchChange$.next(this.query);
            } else {
                this.localSearch();
            }
            this.openFlyout(); // open the flyout when there is a change
        }

        if(this.query.length <= 2){
            this.results = [];
            this.closeFlyout();
        }
    }

    /**
     * triggers on selectable-list:select -> onClick event in selectable-list
     */
    public onSelect(item: any = null): void {
        if(!item){
            item = this.query;
        }
        this.propagateChange(item !== null ? (this.label ? item[this.label] : item) : '');
        this.closeFlyout(); // Close the flyout manually
    }

    public onFlyoutClosed(): void {
        // there is only 1 result, select it
        if (this.index >= 0 && this.results.length === 1) {
            return this.onSelect(this.results[0]);
        }

        // there is no query nor selected item, clear the selected item
        if (!this.query && this.index < 0) {
            return this.onSelect(null);
        }

        // reset the query for an invalid query if clearInvalid is true
        if (this.clearInvalid && this.query && (!this.results || !this.results.length) && this.index < 0) {
            this.query = this.selectedItem ? this.label ? this.selectedItem[this.label] : this.selectedItem : '';
        }
    }

    public onKeyArrowDown(): void {   
        if (this.index < this.results.length - 1) {
            this.scrollList(1);
        }
        this.openFlyout();
    }

    public onKeyArrowUp(): void {
        if (this.index >= 0) {
            this.scrollList(-1);
        }
    }

    public onKeyEnter(event: Event): void {
        event.preventDefault(); // Do not submit form when selecting an item.
        
        const query = this.index >= 0 ? this.query = this.results[this.index][this.label] : this.query;
        this.propagateChange(query);
        this.closeFlyout();
    }

    public onKeyEscape(): void {
        this.closeFlyout();
    }

    public onFocus(): void {
        if(this.showAllByDefault){
            this.focused = true;
            this.openFlyout();
        }
    }

    public openFlyout(): void {
        if (this.flyout) {
            this.flyout.open();
        }
    }

    public closeFlyout(): void {
        if (this.flyout) {
            this.flyout.close();
        }
        this.focused = false;
    }

    public localSearch(): void {
        this.results = [];

        if (this.results.length === 1 && this.query === this.results[0][this.label]) {
            this.index = 0;
        }

        this.searching = false;
    }

    public remoteSearch(): void {
        if (!this.remoteValue || !this.data) {
            return;
        }

        const selected = this.data.find((item: any) => {
            if (this.value) {
                return item[this.value] === this.query;
            }

            return item === this.query;
        });

        if (selected) {
            this.query = this.label ? selected[this.label] : selected;
        } else {
            this.query = '';
        }

        this.remoteValue = false;
    }

    public scrollList(factor: number): void {
        this.index += factor;

        if (!this.flyoutZone) {
            return;
        }

        const liItems = this.flyoutZone.element.getElementsByTagName('li');
        const liHeight = (liItems[1] ? liItems[1].offsetHeight : liItems[0].offsetHeight);
        const zoneHeight = this.flyoutZone.element.offsetHeight;
        const offset = (zoneHeight / liHeight) / 2;

        this.flyoutZone.element.scrollTop = (this.index * liHeight) - (offset * liHeight);
    }
}