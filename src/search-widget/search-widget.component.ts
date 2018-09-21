import {
    Component,
    Input,
    OnInit,
    ViewEncapsulation,
    Output,
    EventEmitter,
    ViewChild,
    ElementRef,
    ChangeDetectorRef
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { of } from 'rxjs/observable/of';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { mergeMap } from 'rxjs/operators/mergeMap';

import { SearchWidgetValue } from './search-widget.types';
import { SearchWidgetService } from './search-widget.service';
import { AutoCompleteComponent } from '@acpaas-ui/auto-complete';

@Component({
    selector: 'aui-search',
    styleUrls: ['./search-widget.component.scss'],
    templateUrl: './search-widget.component.html',
    encapsulation: ViewEncapsulation.None,
})

export class SearchWidgetComponent implements OnInit {
    /* POST or a GET method to get suggestions */
    @Input() public method = 'GET';
    /* Language of the query suggestions */
    @Input() public language = 'NL';
    /* (Api) Url to provide suggestions for a search */
    @Input() public url = '';
    /** The value of the search */
    @Input() public searchValue: SearchWidgetValue = { value: '' };
    /* List of suggestions provided by the url */
    @Input() public suggestions: SearchWidgetValue[];
    /* Minimum characters before the search */
    @Input() public minCharacters = 2;
    /* Search incentive text */
    @Input() public searchIncentiveText = 'Vind je vraag hier';
    /* No results text */
    @Input() public noResultsText = 'Geen resultaten gevonden';
    /* Loading text */
    @Input() public loadingText = '';
    /** If SearchWidgetValue is an object add label to show  */
    @Input() public label = '';
    /** SearchResult */
    @Input() public query = '';
    /** A limit for suggestions */
    @Input() public limit = '';
    /** Change location of searchbox */
    @Input() public iconLeft;

    /** the event fired when the search is triggered */
    @Output() public search: EventEmitter<any> = new EventEmitter<any>();

    /** the autocomplete component */
    @ViewChild(AutoCompleteComponent) public autocomplete: AutoCompleteComponent;

    private searchChange$: Observer<string>;
    public id = 'search';

    constructor(
        private searchWidgetService: SearchWidgetService,
        private element: ElementRef,
        private cdRef: ChangeDetectorRef) { }

    /** Set the focus in the text field, selecting all text. */
    public focus(): void {
        const nativeEl = this.element.nativeElement;
        if (nativeEl && nativeEl.querySelector) {
            const input = nativeEl.querySelector('input[type="text"]');
            if (input) {
                input.select();
            }
        }
    }

    initValue(value: string): void {
        if (this.searchValue && this.searchValue.value) {
            this.searchValue.value = value;
        } else {
            this.searchValue = { value: value };
        }
        this.cdRef.detectChanges();
        this.onSearch(value);
    }

    ngOnInit() {
        this.focus();
        this.resetSuggestions();
        this.subscribeOpenFlyout();
        Observable
            .create(observer => { this.searchChange$ = observer; })
            .pipe(
                debounceTime(300),
                mergeMap(() => {
                    if (this.query && (this.query.length >= this.minCharacters)) {
                        if (this.method === 'GET') {
                            return this.searchWidgetService.getSearchWidgetResults(this.url, this.query);
                        } else if (this.method === 'POST') {
                            return this.searchWidgetService.postSearchWidgetResults(this.url, {
                                query: this.query,
                                language: this.language
                            });
                        } else {
                            console.error('Unsupported method on API: ', this.method);
                        }
                    } else {
                        // If debouncetime is >100, the user is faster then the debouncetime
                        // API-call will take the last item in the observer which can be
                        // smaller then the minCharacters
                        return of(null);
                    }
                })
            ).subscribe(suggestions => {
                if (suggestions) {
                    this.suggestions = suggestions.terms;
                }
            });
    }

    public subscribeOpenFlyout(): void {
        this.autocomplete.flyout.opened.subscribe((x) => {
            if (this.query.length < this.minCharacters) {
                this.autocomplete.flyout.close();
            }
        });
    }

    public onSearch(searchString: string): void {
        if (searchString.length >= this.minCharacters) {
            this.searchChange$.next(searchString);
        } else {
            this.autocomplete.flyout.close();
        }
        this.resetSuggestions();
        this.query = searchString;
    }

    public onSelect(data: Event | any): void {
        if (data instanceof Event) {
            // do nothing: we don't respond to text selection events
        } else if (data && data.length >= this.minCharacters) {
            this.search.emit(data);
            this.query = data;
        } else if (!data && this.query) {
            if (this.query.length >= this.minCharacters) {
                this.search.emit(this.query);
            }
        }
    }

    public resetSuggestions(): void {
        this.suggestions = [];
    }
}
