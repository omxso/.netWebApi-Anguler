import { HttpClient, HttpParams } from "@angular/common/http";
import { map } from "rxjs/operators";
import { PaginatedResult } from "../_models/pagination";

export function getPaginatedResult<T>(url, params, http: HttpClient) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();//sotre result in 
    return http.get<T>(url, { observe: 'response', params }).pipe(
      map(response => {
        paginatedResult.result = response.body;
        if (response.headers.get('pagination') !== null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('pagination'));
        }
        return paginatedResult;
      })
    );
  }

  export function getPaginationHeaders(pageNumber: number , pageSize: number) {
    let params = new HttpParams();//gives the appilty to serilaze the param and add on to our query string

    // if(page !== null && itemPerPage !== null) {//()
      params = params.append('pageNumber', pageNumber.toString());//Appends = a new value to existing values for a parameter.
      params = params.append('pageSize', pageSize.toString());

      return params;
    
  }