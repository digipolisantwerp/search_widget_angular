import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { SearchWidgetModule, SearchWidgetService , SearchWidgetValue, SearchWidgetComponent} from '..';

describe('SearchWidgetComponent', () => {
    let fixture: ComponentFixture<SearchWidgetComponent>;
    let comp: SearchWidgetComponent;
    let element: any;
    let testValues: Array<SearchWidgetValue> = [
        { tag: "Aankoopsuggestie" }
    ];

    class MockSearchWidgetService {
        getSearchWidgetResults(dataSource: any, search: string) {
            return Observable.of(testValues);
        }
    }

    const provideTestValues = (count: number = 1) => {
        testValues = [];
        for (let i = 0; i < count; i++) {
            testValues.push({ tag: "Aankoopsuggestie" });
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
        comp = fixture.componentInstance;
        element = fixture.nativeElement;
    });

    afterEach(() => {
        if (element) {
            document.body.removeChild(element);
        }
    });


    it('should not query values for a short text', (done) => {
        comp.minCharacters = 4;
        comp.ngOnInit();
        fixture.detectChanges();
        const spy = spyOn(comp, 'doSearch');
        const input = element.querySelector('input[type=text]');
        input.value = 'foo';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        setTimeout(() => {
            expect(spy).toHaveBeenCalled();
            done();
        }, 10);
    });

    it('should query values', (done) => {
        provideTestValues(2);
        comp.ngOnInit();
        fixture.detectChanges();
        const input = element.querySelector('input[type=text]');
        input.value = 'Aankoop';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        setTimeout(() => {
            expect(comp.results).not.toBeNull();
            expect(comp.results.length).toEqual(0);
            done();
        }, 10);
    });

    it('should clear the search results on value clear', () => {
        comp.value = testValues[0].tag;
        comp.results = testValues;
        fixture.detectChanges();
        comp.writeValue(null);
        expect(comp.results.length).toBe(0);
    });
});
