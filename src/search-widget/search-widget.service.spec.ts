import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { SearchWidgetService, SearchWidgetValue } from '..';
import { environment } from '../../config/environment';

describe('SearchWidgetService', () => {
    const testValues: SearchWidgetValue[] = [
        {tag: 'Ondernemen in Antwerpen', count : 3}
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

    it('should query values via http', (done) => {
        service.getSearchWidgetResults(environment.url + 'suggestions.json').subscribe((res: any) => {
            expect(res).toEqual(testValues);
            done();
        });

        const req = httpMock.expectOne(environment.url + 'suggestions.json');
        req.flush(testValues);
    });
});
