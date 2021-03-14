import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from './_models/user';
import { AccountService } from './_services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'The dataing app';
  users: any;

  constructor(/*private http: HttpClient*/ private accountService: AccountService){}//bring in AccountService into appcompo

  ngOnInit() {
    //this.getUsers();
    this.setCurrentUser();
  }

  setCurrentUser(){
    const user: User = JSON.parse(localStorage.getItem('user'));
    this.accountService.setCurrentUser(user);
  }
  //getUsers(){
    //this.http.get('https://localhost:5001/api/users'/* this needs to be exatly what the end point is  */).subscribe(response => {
     // this.users = response;//// we use this keyword to access any element in the class
    //}, error => {
     // console.log(error);
    //})
  //}
}
