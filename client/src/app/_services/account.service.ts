import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import {map} from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root'
})//injectaple decoriter , injected to other comp and serv
export class AccountService { // use to make request to the api
  baseUrl = environment.apiUrl; // : for taypes , = values
  private currentUserSource = new ReplaySubject<User>(1);//observable to store the user in, ReplaySubject= special observable, <User>=type of user, (1) how many value to store
  currentUser$ = this.currentUserSource.asObservable();// $ at the end mean its an Observable
  constructor(private http: HttpClient, private presence: PresenceService)  { }
  //inject the http clinet  into the account service

  login(model:any)
  {
    return this.http.post(this.baseUrl + 'account/login', model).pipe( // any thing inside the pipe will be an RxJS
      map((response: User) => //map function from RxJS, same as map function in JS, User used to be any
      {
        const user = response; // we wnat to get the user from the response
        if (user) { //this mean eather we have a user or we dont (null)
          // localStorage.setItem('user', JSON.stringify(user)); //populate the user object we get back in local storge in the browser
          // this.currentUserSource.next(user);//set observable to curent user we get back from API
          this.setCurrentUser(user);
          this.presence.createHubContnection(user); //SignalR
        }  
      })
    )
    //model = request body
    //any thing inside the pipe will be RxJS oprator
  }

  register(model:any){
    return this.http.post(this.baseUrl + 'account/register', model).pipe(
      map((user: User) => {
        if(user) {
          this.setCurrentUser(user);
          this.presence.createHubContnection(user); //SignalR

        }
      }))
    
  }

  setCurrentUser(user: User) {//helper mathod , set to User
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;
    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles); 
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  logout(){ //logout method
    localStorage.removeItem('user');//remove the item from local storge based on key value
    this.currentUserSource.next(null);//set observable = to null
    this.presence.stopHubConnection(); //SignalR
  }

  getDecodedToken(token) {
    return JSON.parse(atob(token.split('.')[1])); // atob : this will allow to decoed the information inside what the token is returned 
  }
}
//1-services are injectable
//2-anguler service is singleton when its 
//inititlaized it will saty this way inteal 
//the app is dispose of
//3-component are destroyed when they are not used
//4-we mostly use services to make http requests
