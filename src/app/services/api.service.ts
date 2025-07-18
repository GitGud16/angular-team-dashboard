import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import {  TeamMembersResponse } from '../models/team-member.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly API_URL = 'https://accurate-spoonbill-539.convex.site/members';
  private http = inject(HttpClient);

  // constructor(private http: HttpClient) { }

    getTeamMembers():Observable<TeamMembersResponse>{
      return this.http.get<TeamMembersResponse>(this.API_URL).pipe(
        retry(2),
        catchError(this.handleError)
      )
    }


    private handleError(error: HttpErrorResponse):Observable<never>{
      let errorMessage = 'An unknown error occured';

      if(error.error instanceof ErrorEvent){
        errorMessage = `Error: ${error.error.message}`
      }else{
        errorMessage=`Error Code: ${error.status}\nMessage: ${error.message}`
      }

      console.error(errorMessage);
      return throwError(()=>new Error(errorMessage));
    }

}
