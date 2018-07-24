import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { SearchWidgetService, SearchWidgetValue } from '..';
import { environment } from '../../config/environment.prod';

describe('SearchWidgetService', () => {
    const testValues: SearchWidgetValue[] = [
        { value: 'Aankoopsuggestie'}
    ]

    let service: SearchWidgetService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                SearchWidgetService
            ]
        });
        service = TestBed.get(SearchWidgetService);
        httpMock = TestBed.get(HttpTestingController);
    });

    it('should query values via post http', (done) => {
        service.postSearchWidgetResults(environment.url, "Aankoopsuggestie").subscribe((res: any) => {
            expect(res).toEqual(testValues);
            done();
        });
        const req = httpMock.expectOne('');
        req.flush(testValues);
    });

});
