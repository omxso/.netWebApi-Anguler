import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { take } from 'rxjs/operators';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';

@Directive({
  selector: '[appHasRole]' 
})
export class HasRoleDirective implements OnInit {
  @Input() appHasRole: string[];
  user: User;

  constructor(private viewCountainerRef: ViewContainerRef ,
     private tamplateRef: TemplateRef<any>, private accountService: AccountService) {
       this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
         this.user = user;
       })
      }
  ngOnInit(): void { 
    //clrear view if no roles
    if(!this.user?.roles || this.user == null){
      this.viewCountainerRef.clear();
      return;
    }

    if(this.user?.roles.some(r => this.appHasRole.includes(r))) { //if user has a role that is going to be spicifed insdie appHasRole then show element eals clear
      this.viewCountainerRef.createEmbeddedView(this.tamplateRef);
    } else {
      this.viewCountainerRef.clear();
    }
  }


}
