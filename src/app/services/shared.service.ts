import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private apiUrl = 'http://localhost:8080/api'
 hasClicked: boolean = false;

  onCreateClick(): boolean {
    this.hasClicked = true;
    return this.hasClicked;
  }

  constructor() { }
}
