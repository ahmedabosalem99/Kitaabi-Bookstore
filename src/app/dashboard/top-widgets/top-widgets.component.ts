// import { Component, OnInit } from '@angular/core';
// import {
//   faLocation,
//   faShop,
//   faBoxes,
//   faMoneyBill,
// } from '@fortawesome/free-solid-svg-icons';

// import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// @Component({
//   selector: 'app-top-widgets',
//   imports:[FontAwesomeModule],
//   templateUrl: './top-widgets.component.html',
//   styleUrls: ['./top-widgets.component.css']
// })
// export class TopWidgetsComponent implements OnInit {

//   faLocation = faLocation;
//   faShop = faShop;
//   faBoxes = faBoxes;
//   faMoneyBill = faMoneyBill;

//   constructor() { }

//   ngOnInit(): void {
//   }

// }
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../core/services/dashboard.service';
import {
  faLocation,
  faShop,
  faBoxes,
  faMoneyBill,
} from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-top-widgets',
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: './top-widgets.component.html',
  styleUrl: './top-widgets.component.css',
})
export class TopWidgetsComponent implements OnInit {
  faLocation = faLocation;
  faShop = faShop;
  faBoxes = faBoxes;
  faMoneyBill = faMoneyBill;

  dashboardData: any;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getDashboardData().subscribe((data) => {
      this.dashboardData = data;
    });
  }
}
