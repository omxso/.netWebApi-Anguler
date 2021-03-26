import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_modules/member';

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

  constructor(private http: HttpClient) { }

  getMembers()  {
    if(this.members.length >0 ) return of (this.members)
    return this.http.get<Member[]>(this.baseUrl + 'users').pipe(
    map( members => {
      this.members = members;
      return members;
    }) )//specify the type inside the method
  }

  getMember(username: string){
    const member = this.members.find (x => x.username === username); //find method undefined if the elmemnt has no vlaue
    if(member !== undefined) return of (member);
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
}
