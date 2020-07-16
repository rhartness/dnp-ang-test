import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import {Book} from './book';
import { Observable, throwError } from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  private apiBase = "https://booksapi.azurewebsites.net/api/Books";

  constructor(private http: HttpClient) { }

  getBooks(): Observable<Book[]> 
  {
    let request = this.apiBase;

    return this.http
      .get<Book[]>(request)
      .pipe(catchError(this.handleErrors));
  }

  deleteBook(id): Observable<any> 
  {
    let request = this.apiBase + "/" + id;
    return this.http
      .delete(request)
      .pipe(catchError(this.handleErrors));
  }  

  handleErrors(handleError: HttpErrorResponse)
  {
    return throwError(handleError.message);
  }
}
