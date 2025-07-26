import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
 hasClicked: boolean = false;

  onCreateClick(): boolean {
    this.hasClicked = true;
    return this.hasClicked;
  }

  constructor() { }
}
