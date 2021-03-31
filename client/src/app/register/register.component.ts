import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  // model: any ={};
  registerForm: FormGroup;//Tracks the value and validity state of a group of FormControl instances.
  maxDate: Date; // from 18+ users only
  validationErrors: string[] = [];//save the error that we get back

  constructor(private accountService: AccountService, private toastr: ToastrService,
     private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void { 
    this.intitilaizeFrom();
    this.maxDate = new Date ();
    this.maxDate.setFullYear(this.maxDate.getFullYear() -18);// dose not allow any user yunger than 18
  }

  intitilaizeFrom() {
    this.registerForm = this.fb.group ({
      username: ['', Validators.required],//first pra string of strting value, second is Validators
      gender: ['male'],//this will be a radio button with intital value of male 
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4),Validators.maxLength(8)]],//to use multi Validators put insdoe array
      confirmPassword: ['', [Validators.required, this.matchValues('password')]]
    })
  }

  matchValues(matchTo: string): ValidatorFn {// to add a custom Validators create a new method, ValidatorFn Validator Function id the return value
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.controls[matchTo].value // compaeare confirmPassword to password
      ? null : {isMatching: true} // if valid returen null if not return invalid
    }// all our form derive from AbstractControl
  }

  register(){
    // console.log(this.registerForm.value);//this will contain the values of the form controlles
    //console.log(this.model);
    this.accountService.register(this.registerForm.value).subscribe(response => { // subscribe to responce that we get back from the method
    this.router.navigateByUrl('/members');
    }, error => {
      this.validationErrors = error;
    })
  }

  cancel () {
    this.cancelRegister.emit(false);// what we want to emit when the cancel button is clicked
  }

}
