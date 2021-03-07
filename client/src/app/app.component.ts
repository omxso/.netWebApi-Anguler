import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'The dataing app';
  users: any;

  constructor(private http: HttpClient){}

  ngOnInit() {
    this.getUsers();
  }
  getUsers(){
    this.http.get('https://localhost:5001/api/users'/* this needs to be exatly what the end point is  */).subscribe(response => {
      this.users = response;//// we use this keyword to access any element in the class
    }, error => {
      console.log(error);
    })
  }
}
