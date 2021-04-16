import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { Member } from "../_modules/member";
import { MembersService } from "../_services/members.service";
@Injectable({
    providedIn: 'root'
})
export class MemberDetailResolver implements Resolve<Member> {

    constructor(private memberServices: MembersService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<Member> {// you can use this to get any type of data you want before the copmop is cunstrcted
        return this.memberServices.getMember(route.paramMap.get('username'));//you do not need to subscrib insdie a resolver the router will take care of that
    }

}