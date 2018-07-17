import { Component, Input, OnInit, ViewEncapsulation, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Observer, Observable } from 'rxjs';

import { SearchWidgetValue } from './search-widget.types';
import { SearchWidgetService } from './search-widget.service';
import { AutoCompleteComponent } from '@acpaas-ui/auto-complete';

@Component({
    selector: 'aui-search',
    styleUrls: [ './search-widget.component.scss'],
    templateUrl: './search-widget.component.html',
    encapsulation: ViewEncapsulation.None,
})

export class SearchWidgetComponent implements OnInit {
    /* POST or a GET method to get suggestions */
    @Input() public method: string = 'GET';
    /* Language of the query suggestions */
    @Input() public language: string = 'NL';
    /* (Api) Url to provide suggestions for a search */
    @Input() public url: string = '';
    /* List of suggestions provided by the url */
    @Input() public suggestions: SearchWidgetValue[];
    /* Minimum characters before the search */
    @Input() public minCharacters: number = 2;
    /* Search incentive text */
    @Input() public searchIncentiveText: string = "Geen resultaten gevonden";
    /* No results text */
    @Input() public noResultsText: string = "Geen resultaten gevonden";
    /* Loading text */
    @Input() public loadingText: string = "Laden...";
    /* Input placeholder text */
    @Input() public placeholder: string = ""
    /** the value that of the user input */
    @Input() public searchValue: SearchWidgetValue;
    /** If SearchWidgetValue is an object add label to show  */
    @Input() public label: string = '';
    /** SearchResult */
    @Input() public query: string = '';
    /** A limit for suggestions */
    @Input() public limit: string = '';

    /** the event fired when the search is triggered */
    @Output() public search: EventEmitter<any> = new EventEmitter<any>();

    /** the autocomplete component */
    @ViewChild(AutoCompleteComponent) public autocomplete: AutoCompleteComponent;

    private searchChange$: Observer<string>;

    constructor(
        private searchWidgetService: SearchWidgetService,
        private element: ElementRef
    ) { }

    /** Set the focus in the text field, selecting all text. */
    public focus(): void {
        const nativeEl = this.element.nativeElement;
        if (nativeEl && nativeEl.querySelector) {
            const input = nativeEl.querySelector('#tryout');
            if (input) {
                input.select();
            }
        }
    }

    ngOnInit() {
        this.resetSuggestions();
        Observable.create(observer => {
            this.searchChange$ = observer;
        }).debounceTime(300)
          .mergeMap(() => {
              if(this.method === 'GET'){
                  return this.searchWidgetService.getSearchWidgetResults(this.url, this.searchValue.value);
              }else if(this.method === 'POST'){
                return this.searchWidgetService.postSearchWidgetResults(this.url, { 
                    query: this.query, 
                    language: this.language
                });
              }else{
                  console.error('Unsupported method on API: ', this.method);
              }
          })
          .subscribe(suggestions => {
            this.suggestions = suggestions.terms;
            if(this.query){
                this.autocomplete.writeValue(this.query);
            }   
        });
    }

    public onSearch(searchString: string): void {
        if (searchString.length >= this.minCharacters) {
            this.searchChange$.next(searchString);
        }
        this.resetSuggestions();
        this.query = searchString;
    }

    public onSelect(data: Event | any): void {
        if (data instanceof Event) {
            // do nothing: we don't respond to text selection events
        } else if(data) {
            this.search.emit(data);
        }else if(!data && this.query){
            if (this.query.length >= this.minCharacters) {
                this.search.emit(this.query);
            }
        }
    }

    public resetSuggestions(): void {
        this.suggestions = [];
        // if an initial value is set, focusing+blurring the field
        // should not clear the field
        if (this.searchValue && !this.suggestions.length) {
            this.suggestions = [this.searchValue];
        }
    }
}