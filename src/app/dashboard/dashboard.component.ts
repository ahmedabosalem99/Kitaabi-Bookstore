import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { HeaderComponent } from './header/header.component';
import { LastFewTransactionsComponent } from './last-few-transactions/last-few-transactions.component'
import {MainComponent} from './main/main.component'
import { SideNavComponent } from './side-nav/side-nav.component'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faShop } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule, MatCardModule, MatListModule ,HeaderComponent ,MainComponent, SideNavComponent ,FontAwesomeModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  dashboardData: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('http://localhost:3000/dashboard').subscribe(data => {
      this.dashboardData = data;
    });
  }
}