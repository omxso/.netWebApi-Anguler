import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  //@Input() usersFromHomeComponent : any; //input prop, parent to child comm
  @Output() cancelRegister = new EventEmitter();//output prop, child to parent comm
  model: any ={};

  constructor(private accountService: AccountService, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  register(){
    //console.log(this.model);
    this.accountService.register(this.model).subscribe(response => { // subscribe to responce that we get back from the method
      console.log(response);
      this.cancel();
    }, error => {
      console.log(error);
      this.toastr.error(error.error)
    })
  }

  cancel () {
    this.cancelRegister.emit(false);// what we want to emit when the cancel button is clicked
  }

}
