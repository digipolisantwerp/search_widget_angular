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
            testValues.push({tag: 'string'});
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
        console.log(testValues);
        fixture = TestBed.createComponent(SearchWidgetComponent);
        comp = fixture.componentInstance;
        element = fixture.nativeElement;
    });

    afterEach(() => {
        if (element) {
            document.body.removeChild(element);
        }
    });


});

class MockElementRef extends ElementRef {
    constructor() { super(null); }
}
