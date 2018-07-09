import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { SearchWidgetValue } from '..';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
  
@Injectable()
export class SearchWidgetService {
    
    constructor(private http: HttpClient) { }

    /** GET getSearchWidgetResults */
    getSearchWidgetResults (
        /**
         * The URL for contacting the BFF,
         * appending search=<search> as query argument.
         */
        dataSource: string, 
        /** The string to search for */
        search: string = null) {
        if (typeof dataSource === 'string') {
            const uri = dataSource +
                ((dataSource.indexOf('?') < 0) ? '?' : '&') +
                'search=' + search;
                // TEMP: dataSource instead of uri => MockData
                return this.http.get<Observable<SearchWidgetValue[]>>(dataSource, httpOptions).pipe(
                    tap(data => data),
                    catchError(this.handleError('getSearchWidgetResults', []))
                );
            } else {
            // should never happen
            throw new TypeError('unsupported dataSource type "' + (typeof dataSource) + '"');
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
        console.error(error); // log to console instead
        this.log(`${operation} failed: ${error.message}`);
    
        // Let the app keep running by returning an empty result.
        return Observable.of(result as T);
        };
    }

   private log(message: string) {
        console.error('Message', message);
    }
}