import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, pipe } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { PaginatedResult } from '../_models/pagination';
import { User } from '../_models/user';
import { UserParams } from '../_models/userParams';
import { Member } from '../_modules/member';
import { AccountService } from './account.service';

// const httpOptions = {
//   headers: new HttpHeaders({
//     Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user'))
//   })
// }

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];
  memberCache = new Map(); // store keys to diffrent sorting request
  user: User;
  userParams: UserParams;
 

  constructor(private http: HttpClient, private accountService: AccountService) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
      this.userParams = new UserParams(user);
    })
  }

  getUserParams() {//hepler method
    return this.userParams;
  }

  setUserParams(params: UserParams) {//hepler method
    this.userParams = params
  }

  resetUserParams(){
    this.userParams = new UserParams(this.user);
    return this.userParams;
  }

  getMembers(userParams: UserParams)  {
    // console.log(Object.values(userParams).join('-'));//we can find the keys of the sorting requst
    var response = this.memberCache.get(Object.values(userParams).join('-'));//get the key of the request
    if(response){ // if there is response then return the parsed response
      return of(response);
    }

     let params = this.getPaginationHeaders(userParams.pageNumber, userParams.pageSize);

     params = params.append('minAge' , userParams.minAge.toString());
     params = params.append('maxAge' , userParams.maxAge.toString());
     params = params.append('gender' , userParams.gender);
     params = params.append('orderBy' , userParams.orderBy);
    // if(this.members.length >0 ) return of (this.members)(Old)
    return this.getPaginatedResult<Member[]>(this.baseUrl + 'users', params)
       .pipe(map(response => {
         this.memberCache.set(Object.values(userParams).join('-'), response);
         return response;
       }))
    // map( members => {(Old)
    //   this.members = members;
    //   return members;
    // }) )//specify the type inside the method
  }

  getMember(username: string){
    // const member = this.members.find (x => x.username === username); //find method undefined if the elmemnt has no vlaue
    // if(member !== undefined) return of (member);
    const member = [...this.memberCache.values()]
        .reduce((arr, elem) => arr.concat(elem.result), [])
        .find((member: Member) => member.username === username);
    if(member){
      return of(member);
    }
    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }

  updateMember(member: Member){
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);//find the index of the member
        this.members[index] = member;
      })
    )
  }

  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});//method to set the main photo,brcuse its a put request we need to send sonthing in the body that is way we send an empty object {}
  }

  deletePhoto(photoId: number){
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }

  private getPaginatedResult<T>(url, params) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();//sotre result in 
    return this.http.get<T>(url, { observe: 'response', params }).pipe(
      map(response => {
        paginatedResult.result = response.body;
        if (response.headers.get('pagination') !== null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('pagination'));
        }
        return paginatedResult;
      })
    );
  }

  private getPaginationHeaders(pageNumber: number , pageSize: number) {
    let params = new HttpParams();//gives the appilty to serilaze the param and add on to our query string

    // if(page !== null && itemPerPage !== null) {//()
      params = params.append('pageNumber', pageNumber.toString());//Appends = a new value to existing values for a parameter.
      params = params.append('pageSize', pageSize.toString());

      return params;
    
  }
  
}
