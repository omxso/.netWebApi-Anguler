import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class BusyService {
  busyRequestCount = 0;// add to this counter every time the request is completed

  constructor(private spinnerService: NgxSpinnerService) { }

  busy(){
    this.busyRequestCount++;
    this.spinnerService.show(undefined, {
      type: 'pacman',//the type of spinner
      bdColor: 'rgpa(255,255,255,0)',//background color
      color: '#333'//spinner color
    })
  }

  idle(){
    this.busyRequestCount--;
    if(this.busyRequestCount <=0){
      this.busyRequestCount =0;
      this.spinnerService.hide();
    }
  }
}
