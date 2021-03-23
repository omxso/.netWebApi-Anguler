import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';

@Injectable({
  providedIn: 'root'
})
export class PreventUnsavesChangesGuard implements CanDeactivate<unknown> {
  canDeactivate(
    component: MemberEditComponent):boolean {
      if(component.editForm.dirty) {
        return confirm('Are you sure you want to continue? Any unsaved changes will be lost');//if any change occured and the user trise to change the rout a conformation message will appeaer
      }
    return true;
  }
  
}
