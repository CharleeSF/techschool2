import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  toggle: boolean;
  test: number;

  constructor() {
    this.toggle = false;
    this.test = 5;
  }

  ngOnInit() {
  }

  toggleCollapse() {
    document.getElementById('navbarColor01').classList.toggle('collapse')
  }

}
