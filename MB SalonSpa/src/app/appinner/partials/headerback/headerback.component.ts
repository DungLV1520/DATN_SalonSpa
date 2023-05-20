import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-headerback',
  templateUrl: './headerback.component.html',
  styleUrls: ['./headerback.component.scss']
})
export class HeaderbackComponent implements OnInit {  
  
  constructor() { }

  ngOnInit(): void {
  }

  backnav() {
    window.history.back();
    return false;
  }


}
