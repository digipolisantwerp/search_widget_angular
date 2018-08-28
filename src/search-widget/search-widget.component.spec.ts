import { TestBed, ComponentFixture } from '@angular/core/testing';

import { SearchWidgetComponent, SearchWidgetService, SearchWidgetValue, SearchWidgetModule } from '..';
import { of } from 'rxjs/observable/of';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('SearchWidgetComponent', () => {
    let debugElement: DebugElement;
    let fixture: ComponentFixture<SearchWidgetComponent>;
    let comp: SearchWidgetComponent;
    let element: any;
    let testValues: SearchWidgetValue[] = [];

    class MockSearchWidgetService {
        public getSearchWidgetResults(dataSource: any, search: string) {
            return of(testValues);
        }
    }

    const provideTestValues = (count: number = 1) => {
        testValues = [];
        for (let i = 0; i < count; i++) {
            testValues.push({value: 'string'});
        }
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [SearchWidgetModule],
            providers: [
                { provide: SearchWidgetService, useClass: MockSearchWidgetService }
            ]
        });

        provideTestValues(1);
        fixture = TestBed.createComponent(SearchWidgetComponent);
        debugElement = fixture.debugElement;

        comp = fixture.componentInstance;
        comp.method = 'GET';
        comp.language = 'NL';
        comp.url = '';
        comp.searchValue = {value: ''};
        comp.suggestions = [];
        comp.minCharacters = 2;
        comp.searchIncentiveText = 'Vind je vraag hier';
        comp.noResultsText = 'Geen resultaten gevonden';
        comp.loadingText = '';
        comp.label = '';
        comp.query = '';
        comp.limit = '';
        comp.iconLeft = false;
        element = fixture.nativeElement;
        fixture.detectChanges();
    });

    afterEach(() => {
        if (element) {
            document.body.removeChild(element);
        }
    });

    it('should select the text on focus()', (done) => {
        comp.searchValue = testValues[0];
        fixture.detectChanges();
        const input = element.querySelector('input[type=text]');
        input.select = () => { done(); };
        comp.focus();
    });

    it('should not query values for a short text', (done) => {
        comp.minCharacters = 4;
        comp.ngOnInit();
        fixture.detectChanges();
        const spy = spyOn(comp, 'onSearch');
        const input = element.querySelector('input[type=text]');
        input.value = 'foo';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        setTimeout(() => {
            expect(spy).toHaveBeenCalled();
            done();
        }, 10);
    });

    it('Selecting a suggestion emits search', (done) => {
        comp.ngOnInit();
        comp.search.subscribe((object) => {
            expect(object).toEqual({value: 'test'});
            done();
        });
        comp.onSelect({value: 'test'});
        fixture.detectChanges();
    });

    it('Selecting text calls onSelect', (done) => {
        spyOn(comp, 'onSelect');
        element = debugElement.query(By.css('.m-search__box__icon')).nativeElement.click();
        expect(comp.onSelect).toHaveBeenCalled();
        done();
    });
});
