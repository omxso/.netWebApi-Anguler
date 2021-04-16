import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Message } from '../_models/message';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getMessages(pageNumber, pageSize, container){
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('Container', container);
    return getPaginatedResult<Message[]>(this.baseUrl + 'messages',params , this.http);
  }

  getMessageThread(username: string){
    return this.http.get<Message[]>(this.baseUrl + 'messages/thread/' + username);
    
  }

  sendMessage(username: string, Content: string){
    return this.http.post<Message>(this.baseUrl + 'messages', {recipientUsername: username, Content}); // {recipientUsername = key: username = value of key, contant = this didnt need a key becuse the name of the url and the element we are passing is the same  exatly as in create message DTO} = an object
  }

  deleteMessage(id: number) {
    return this.http.delete(this.baseUrl + 'messages/' + id);
  }

}