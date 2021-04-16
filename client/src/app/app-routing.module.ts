import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { TestErrorsComponent } from './errors/test-errors/test-errors.component';
import { HomeComponent } from './home/home.component';
import { ListsComponent } from './lists/lists.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { AuthGuard } from './_guards/auth.guard';
import { PreventUnsavesChangesGuard } from './_guards/prevent-unsaves-changes.guard';
import { MemberDetailResolver } from './_resolvers/member-detailed.resolver';

const routes: Routes = [
  {path: '' , component: HomeComponent},
  {
    path:'',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      {path: 'members' , component: MemberListComponent},
      {path: 'members/:username' , component: MemberDetailComponent, resolve: {member: MemberDetailResolver}}, // resolve = give it a key to access the data from insde the resolver
      {path: 'member/edit' , component: MemberEditComponent, canDeactivate: [PreventUnsavesChangesGuard]}, // if use members it will cuse some probolme, adding gaurd so cjabges will not be lost
      {path: 'lists' , component: ListsComponent},
      {path: 'messages' , component: MessagesComponent},
    ]
  },
  {path: 'errors', component: TestErrorsComponent},
  {path: 'not-found', component: NotFoundComponent},
  {path: 'server-error', component: ServerErrorComponent},
  {path: '**', component: HomeComponent, pathMatch: 'full'},
  
]; //Represents a route configuration for the Router service. An array of Route objects, used in Router.config and for nested route configurations in Route.children.

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
