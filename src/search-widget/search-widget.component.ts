import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

import { Observer, Observable } from 'rxjs';
import { SearchWidgetValue, SearchWidgetService } from '..';


@Component({
    selector: 'aui-search',
    styleUrls: [ './search-widget.component.scss'],
    templateUrl: './search-widget.component.html',
    encapsulation: ViewEncapsulation.None,
})

export class SearchWidgetComponent implements OnInit {
    /* (Api) Url to provide suggestions for a search */
    @Input() public url;
    /* BackgroundColor of the icon search box */
    @Input() public colorSearch: string = '018C95';
    /* List of suggestions provided by the url */
    @Input() public suggestions: SearchWidgetValue[] = [];
    /* Minimum characters before the search */
    @Input() public minCharacters: number = 2;
    /* Search incentive text */
    @Input() public searchIncentiveText: string = "Geen resultaten gevonden";
    /* No results text */
    @Input() public noResultsText: string = "Geen resultaten gevonden";
    /* Loading text */
    @Input() public loadingText: string = "Laden...";
    /* Input placeholder text */
    @Input() public placeholder: string = "";

    private searchChange$: Observer<string>;
    public align = 'top';
    public query = '';
    public text = '';

    constructor(private searchWidgetService: SearchWidgetService) { }

    public ngOnInit(): void {
        Observable.create(observer => {
            this.searchChange$ = observer;
        }).debounceTime(300)
          .mergeMap(search => this.searchWidgetService.getSearchWidgetResults(this.url, this.query))
          .subscribe(suggestions => {
            this.suggestions = suggestions.terms;
        });
    }

    onSelect(evt = null){
        if(!evt || evt.target){
            return this.suggestions = []; // Key event instead of text
        }

        if(this.minCharacters >= evt.length){
            return this.suggestions = []; // Less characters
        }
            
        this.searchChange$.next(evt);
    }
}