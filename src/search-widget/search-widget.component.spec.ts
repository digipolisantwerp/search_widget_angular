import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ElementRef } from '@angular/core';

import { SearchWidgetModule } from '..';
import { Observable } from 'rxjs/Observable';
import { SearchWidgetComponent } from './search-widget.component';
import { SearchWidgetValue } from './search-widget.types';

describe('SearchWidgetComponent', () => {
    let fixture: ComponentFixture<SearchWidgetComponent>;
    let comp: SearchWidgetComponent;
    let element: any;
    let testValues: Array<SearchWidgetValue> = [
        { tag: "Ondernemen in Antwerpen", count: 3 }
    ];

    class MockLocationPickerService {
        getLocationsByQuery(dataSource: any, search: string) {
            return Observable.of({});
        }
    }

    const provideTestValues = (count: number = 1) => {
        testValues = [];
        for (let i = 0; i < count; i++) {
            testValues.push({ tag: "Ondernemen in Antwerpen", count: 3 });
        }
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [SearchWidgetModule],
            providers: [
                // { provide: searchWidgetService, useClass: MockLocationPickerService }
            ]
        });
        provideTestValues(1);
        fixture = TestBed.createComponent(SearchWidgetComponent);
        // GIVE EXTRA ATTR
        comp = fixture.componentInstance;
        // comp.bufferInputMs = 0;
        element = fixture.nativeElement;
    });

    afterEach(() => {
        if (element) {
            document.body.removeChild(element);
        }
    });

    it('should select the text on focus()', (done) => {
        comp.value = testValues[0].tag;
        comp.showAllByDefault = true;
        fixture.detectChanges();
        const input = element.querySelector('input[type=text]');
        input.select = () => { done(); };
        console.log(comp.onFocus());
        comp.onFocus();
    });

    // it('should not query values for a short text', (done) => {
    //     comp.minLength = 4;
    //     comp.ngOnInit();
    //     fixture.detectChanges();
    //     const spy = spyOn(comp, 'resetSearchResults');
    //     const input = element.querySelector('input[type=text]');
    //     input.value = 'foo';
    //     input.dispatchEvent(new Event('input'));
    //     fixture.detectChanges();
    //     setTimeout(() => {
    //         expect(spy).toHaveBeenCalled();
    //         done();
    //     }, 10);
    // });

    // it('should query values', (done) => {
    //     provideTestValues(2);
    //     comp.ngOnInit();
    //     fixture.detectChanges();
    //     const input = element.querySelector('input[type=text]');
    //     input.value = 'test';
    //     input.dispatchEvent(new Event('input'));
    //     fixture.detectChanges();
    //     setTimeout(() => {
    //         expect(comp.searchResults).not.toBeNull();
    //         expect(comp.searchResults.length).toEqual(2);
    //         done();
    //     }, 10);
    // });

    // it('should clear the search results on value clear', () => {
    //     comp.value = testValues[0];
    //     comp.searchResults = testValues;
    //     fixture.detectChanges();
    //     comp.writeValue(null);
    //     expect(comp.searchResults.length).toBe(0);
    // });

});

class MockElementRef extends ElementRef {
    constructor() { super(null); }
}
