import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ElementRef } from '@angular/core';

import { SearchWidgetComponent, SearchWidgetService, SearchWidgetValue, SearchWidgetModule } from '..';
import { Observable } from 'rxjs/Observable';

describe('SearchWidgetComponent', () => {

    let fixture: ComponentFixture<SearchWidgetComponent>;
    let comp: SearchWidgetComponent;
    let element: any;
    let testValues: SearchWidgetValue[] = [];

    class MockSearchWidgetService {
        public getSearchWidgetResults(dataSource: any, search: string) {
            return Observable.of(testValues);
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
        })
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
        const spy = spyOn(comp, 'resetSuggestions');
        const input = element.querySelector('input[type=text]');
        input.value = 'foo';
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        setTimeout(() => {
            expect(spy).toHaveBeenCalled();
            done();
        }, 10);
    });
});

class MockElementRef extends ElementRef {
    constructor() { super(null); }
}
