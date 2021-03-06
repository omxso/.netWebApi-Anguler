import { Component, Input, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { take } from 'rxjs/operators';
import { User } from 'src/app/_models/user';
import { Member } from 'src/app/_modules/member';
import { Photo } from 'src/app/_modules/photo';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() member: Member;
  uploder: FileUploader;
  hasBaseDropzoneOver = false;
  baseUrl = environment.apiUrl;
  user: User;

  constructor(private accountService: AccountService, private membersService: MembersService) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
  }

  ngOnInit(): void {
    this.initializeUploder();
  }

  fileOverBase(event: any) {
    this.hasBaseDropzoneOver = event;
  }

  setMainPhoto(photo: Photo){
    this.membersService.setMainPhoto(photo.id).subscribe(() => {
      this.user.photoUrl = photo.url;
      this.accountService.setCurrentUser(this.user)
      this.member.photoUrl = photo.url;
      this.member.photos.forEach(p => {
        if(p.isMine) p.isMine = false;
        if(p.id === photo.id) p.isMine = true;
      })
    })
  }

  deletePhoto(photoId: number){
    this.membersService.deletePhoto(photoId).subscribe(() => {
      this.member.photos = this.member.photos.filter(x => x.id !== photoId);//return an array of all photo exept one we del
    })
  }

  initializeUploder() {
    this.uploder = new FileUploader ({
      url: this.baseUrl + 'users/add-photo',
      authToken: 'Bearer ' + this.user.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024 

    });

    this.uploder.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    }

    this.uploder.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const photo: Photo = JSON.parse(response);
        this.member.photos.push(photo);
         if(photo.isMine){
           this.user.photoUrl = photo.url;
           this.member.photoUrl = photo.url;
           this.accountService.setCurrentUser(this.user);
         }
      }
    }
  }

}
