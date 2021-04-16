import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, pipe } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Message } from '../_models/message';
import { PaginatedResult } from '../_models/pagination';
import { User } from '../_models/user';
import { UserParams } from '../_models/userParams';
import { Member } from '../_modules/member';
import { AccountService } from './account.service';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';

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

     let params = getPaginationHeaders(userParams.pageNumber, userParams.pageSize);

     params = params.append('minAge' , userParams.minAge.toString());
     params = params.append('maxAge' , userParams.maxAge.toString());
     params = params.append('gender' , userParams.gender);
     params = params.append('orderBy' , userParams.orderBy);
    // if(this.members.length >0 ) return of (this.members)(Old)
    return getPaginatedResult<Member[]>(this.baseUrl + 'users', params, this.http)
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

  addLike(username: string){
    return this.http.post(this.baseUrl + 'likes/' + username, {});//the same that we do in postman
  }

  getLikes(predicate: string, pageNumber, pageSize){
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('predicate', predicate);
    return getPaginatedResult<Partial<Member[]>>(this.baseUrl + 'likes', params, this.http);
  }
}
