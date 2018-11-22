import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  empty,
  of as observableOf,
  Observable,
} from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { SearchWidgetValue } from '..';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()
export class SearchWidgetService {

    constructor (private http: HttpClient) { }

    /** GET getSearchWidgetResults */
    getSearchWidgetResults (
        /**
         * The URL for contacting the BFF,
         * appending search=<search> as query argument.
         */
        dataSource: string,
        /** The string to search for */
        search: string = null): Observable<any> {
        if (typeof dataSource === 'string') {
            const uri = dataSource +  ((dataSource.indexOf('?') < 0) ? '?' : '&') + `search=${search}`;
                return this.http.get<Observable<SearchWidgetValue[]>>(uri, httpOptions)
                                .pipe(
                                    tap(data => data),
                                    catchError(this.handleError('getSearchWidgetResults', []))
                                );
            } else {
            // should never happen
            throw new TypeError('Unsupported dataSource type "' + (typeof dataSource) + '"');
        }
    }

    /** POST getSearchWidgetResults */
    postSearchWidgetResults (
        /**
         * The URL for contacting the BFF
         */
        dataSource: string,
        /** The body which contains the query and the language */
        body): Observable<any> {
        if (typeof dataSource === 'string') {
            const uri = dataSource +
                ((dataSource.indexOf('?') < 0) ? '?' : '&');
                return this.http.post<Observable<SearchWidgetValue[]>>(dataSource, JSON.stringify(body), httpOptions)
                                .pipe(
                                    tap(data => data),
                                    catchError((err) => {
                                        console.error('Look at this error:', err);
                                        this.handleError('getSearchWidgetResults', []);
                                        return empty();
                                    })
                                );
            } else {
            // should never happen
            throw new TypeError('Unsupported dataSource type "' + (typeof dataSource) + '"');
        }
    }

    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
        this.log(`${operation} failed: ${error.message}`);

        // Let the app keep running by returning an empty result.
        return observableOf(result as T);
        };
    }

   private log(message: string) {
        console.error('Message', message);
    }
}
